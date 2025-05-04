import { ModelConnectionType, ReferencedMessageThreadRecord } from '@abyss/records';
import { invokeModelAgainstThread } from '../../models/handler';
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
            description: 'Invoke a chat model by giving it a thread and capturing the output',
            color: '#800080',
            parameters: {},
            inputPorts: {
                chatModel: {
                    id: 'chatModel',
                    type: 'data',
                    dataType: 'chat-model',
                    name: 'Chat Model',
                    description: 'A chat model',
                },
                thread: {
                    id: 'thread',
                    type: 'signal',
                    dataType: 'thread',
                    name: 'Thread',
                    description: 'A thread',
                },
            },
            outputPorts: {
                rawResponse: {
                    id: 'rawResponse',
                    type: 'data',
                    dataType: 'string',
                    name: 'Raw Response',
                    description: 'The raw response from the chat model',
                },
                newThread: {
                    id: 'newThread',
                    type: 'data',
                    dataType: 'thread',
                    name: 'New Thread',
                    description: 'The updated thread with the response from the chat model',
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        const inputLanguageModel = data.resolvePort<ModelConnectionType>('chatModel');
        const thread = data.resolvePort<ReferencedMessageThreadRecord>('thread');
        const result = await invokeModelAgainstThread(inputLanguageModel, thread);
        const baseThreadRef = await data.database.tables.messageThread.ref(thread.id);
        const outThread = await baseThreadRef.addMessages({
            senderId: data.execution.graph.id,
            type: 'text',
            payloadData: {
                content: result.outputString,
            },
        });

        return {
            portData: [
                {
                    portId: 'rawResponse',
                    dataType: 'string',
                    inputValue: result.outputRaw,
                },
                {
                    portId: 'newThread',
                    dataType: 'thread',
                    inputValue: outThread,
                },
            ],
        };
    }
}
