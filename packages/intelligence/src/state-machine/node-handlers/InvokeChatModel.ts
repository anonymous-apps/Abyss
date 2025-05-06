import { ReferencedMessageThreadRecord, ReferencedModelConnectionRecord } from '@abyss/records';
import { invokeModelAgainstThread } from '../../models/handler';
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
            description: 'Invoke a chat model by giving it a thread and capturing the output',
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
                chatModel: {
                    id: 'chatModel',
                    type: 'data',
                    dataType: 'chat-model',
                    name: 'Chat Model',
                    description: 'A chat model',
                },
                thread: {
                    id: 'thread',
                    type: 'data',
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
        const outThreadRef = await data.database.tables.messageThread.ref(outThread.id);

        data.execution.publishMetricObject(result.metrics, {
            modelId: model.modelId,
            provider: model.providerId,
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
                    inputValue: outThreadRef,
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
