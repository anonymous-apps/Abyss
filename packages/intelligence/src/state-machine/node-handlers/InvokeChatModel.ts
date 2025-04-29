import { MessageThreadRecord, ModelConnectionRecord } from '@abyss/records';
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
            name: 'Invoke Language Model',
            icon: 'ai',
            description: 'Invoke a language model',
            color: '#800080',
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
                    description: 'The raw response from the language model',
                },
                newThread: {
                    id: 'newThread',
                    type: 'data',
                    dataType: 'thread',
                    name: 'New Thread',
                    description: 'The updated thread with the response from the language model',
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        const inputLanguageModel = data.resolvePort<ModelConnectionRecord>('chatModel');
        const thread = data.resolvePort<MessageThreadRecord>('thread');
        const result = await invokeModelAgainstThread(inputLanguageModel, thread);
        const outThread = await thread.addPartial('bot', {
            type: 'text',
            payload: {
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
