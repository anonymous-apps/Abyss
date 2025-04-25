import { GraphNodeDefinition } from '../../constructs/graphs/graph-node';
import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../types';

export class InvokeLanguageModelNode extends NodeHandler {
    constructor() {
        super('invoke-language-model');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Invoke Language Model',
            icon: 'ai',
            description: 'Invoke a language model',
            color: '#800080',
            inputPorts: {
                languageModel: {
                    id: 'languageModel',
                    type: 'data',
                    dataType: 'language-model',
                    name: 'Language Model',
                    description: 'A language model',
                },
                thread: {
                    id: 'thread',
                    type: 'data',
                    dataType: 'chat-thread',
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
                    dataType: 'chat-thread',
                    name: 'New Thread',
                    description: 'The updated thread with the response from the language model',
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        return {
            portData: [],
        };
    }
}
