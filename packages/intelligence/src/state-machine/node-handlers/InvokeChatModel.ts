import { ReferencedChatThreadRecord, ReferencedMessageRecord, ReferencedModelConnectionRecord } from '@abyss/records';
import { invokeModelAgainstThread } from '../../models/handler';
import { runUnproccessedToolCalls } from '../../tool-handlers/tool-router';
import { randomId } from '../../utils/ids';
import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../type-base.type';
import { GraphNodeDefinition } from '../type-definition.type';

export class InvokeLanguageModelNode extends NodeHandler {
    constructor() {
        super('invoke-language-model', 'dynamic');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Invoke Chat Model',
            icon: 'ai',
            description:
                'Asks a chat model to respond in a chat. The model response is added to the chat and all tools requested are run automatically.',
            color: '#800080',
            parameters: {},
            inputPorts: {
                trigger: {
                    id: 'trigger',
                    type: 'signal',
                    dataType: 'signal',
                    name: 'Invoke',
                    description: 'Invoke the chat model',
                },
                chat: {
                    id: 'chat',
                    type: 'data',
                    dataType: 'chat',
                    name: 'Chat',
                    description: 'A chat',
                },
                chatModel: {
                    id: 'chatModel',
                    type: 'data',
                    dataType: 'chat-model',
                    name: 'Chat Model',
                    description: 'A chat model',
                },
            },
            outputPorts: {
                chat: {
                    id: 'chat',
                    type: 'data',
                    dataType: 'chat',
                    name: 'Chat',
                    description: 'A reference to the input chat',
                },
                next: {
                    id: 'next',
                    type: 'signal',
                    dataType: 'signal',
                    name: 'Next',
                    description: 'What to do next',
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        const inputLanguageModel = data.resolvePort<ReferencedModelConnectionRecord>('chatModel');
        const model = await inputLanguageModel.get();
        const chat = data.resolvePort<ReferencedChatThreadRecord>('chat');
        const thread = await chat.getThread();

        // Tool
        const toolReferences = await thread.getAllActiveToolDefinitions();
        const tools = await Promise.all(toolReferences.map(t => t.get()));

        // Model invoked
        const modelResponse = await invokeModelAgainstThread(inputLanguageModel, thread);
        data.execution.publishMetricObject(modelResponse.metrics, {
            modelId: model.modelId,
            provider: model.providerId,
        });

        // Add model response to chat
        let lastMessageRef: ReferencedMessageRecord | undefined;
        for (const block of modelResponse.parsed) {
            if (block.type === 'text') {
                const messageRecord = await chat.client.tables.message.create({
                    type: 'text',
                    payloadData: {
                        content: block.content,
                    },
                    senderId: data.execution.graph.id,
                });
                await chat.addMessages(new ReferencedMessageRecord(messageRecord.id, chat.client));
                lastMessageRef = new ReferencedMessageRecord(messageRecord.id, chat.client);
            }
            if (block.type === 'tool') {
                const toolKey = Object.keys(block.content)[0];
                const toolLookup = tools.find(t => t.shortName.toUpperCase() === toolKey.toUpperCase());
                if (!toolLookup) {
                    const messageRecord = await chat.client.tables.message.create({
                        type: 'system-error',
                        payloadData: {
                            error: 'Tool not found',
                            message: `Model requested tool ${toolKey} but it was not in the list of available tools`,
                            body: JSON.stringify(block.content, null, 2),
                        },
                        senderId: 'system',
                    });
                    await chat.addMessages(new ReferencedMessageRecord(messageRecord.id, chat.client));
                } else {
                    const messageRecord = await chat.client.tables.message.create({
                        type: 'tool-call-request',
                        payloadData: {
                            toolCallId: randomId(),
                            toolId: toolLookup.id,
                            parameters: block.content[toolKey] as Record<string, unknown>,
                        },
                        senderId: data.execution.graph.id,
                    });
                    await chat.addMessages(new ReferencedMessageRecord(messageRecord.id, chat.client));
                    lastMessageRef = new ReferencedMessageRecord(messageRecord.id, chat.client);
                }
            }
        }

        // Add log stream to chat
        await lastMessageRef?.update({
            referencedData: {
                logStreamId: modelResponse.logStream.id,
            },
        });

        // Run any unprocessed tool calls
        await runUnproccessedToolCalls(chat, data.database);

        return {
            portData: [
                {
                    portId: 'chat',
                    dataType: 'chat',
                    inputValue: chat,
                },
                {
                    portId: 'next',
                    dataType: 'signal',
                    inputValue: randomId(),
                },
            ],
        };
    }
}
