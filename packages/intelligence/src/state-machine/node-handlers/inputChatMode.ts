import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../type-base.type';
import { GraphNodeDefinition } from '../type-definition.type';

export class InputLanguageModelNode extends NodeHandler {
    constructor() {
        super('input-language-model', 'static');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Language Model',
            icon: 'model',
            description: 'Reference to a language model',
            color: '#800080',
            inputPorts: {},
            outputPorts: {
                chatModel: {
                    id: 'chatModel',
                    type: 'data',
                    dataType: 'chat-model',
                    name: 'Chat Model',
                    description: 'A chat based model of intelligence',
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        const modelConnection = await data.database.table.modelConnection.getOrThrow(data.parameters.modelConnectionId);

        return {
            portData: [
                {
                    portId: 'chatModel',
                    dataType: 'chat-model',
                    inputValue: modelConnection,
                },
            ],
        };
    }
}
