import { GraphNodeDefinition } from '../../constructs/graphs/graph-node';
import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../types';

export class InputLanguageModelNode extends NodeHandler {
    constructor() {
        super('input-language-model');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Language Model',
            icon: 'model',
            description: 'Reference to a language model',
            color: '#800080',
            inputPorts: {},
            outputPorts: {
                languageModel: {
                    id: 'languageModel',
                    type: 'data',
                    dataType: 'language-model',
                    name: 'Language Model',
                    description: 'A language model',
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
