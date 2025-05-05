import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../type-base.type';
import { GraphNodeDefinition } from '../type-definition.type';

export class InputLanguageModelNode extends NodeHandler {
    constructor() {
        super('input-language-model', 'static');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Chat Model',
            icon: 'model',
            description: 'Reference to a chat-model from those you have configured',
            color: '#800080',
            inputPorts: {},
            parameters: {},
            outputPorts: {
                chatModel: {
                    id: 'chatModel',
                    type: 'data',
                    dataType: 'chat-model',
                    name: 'Chat Model',
                    description: 'A chat based model of intelligence',
                    userConfigurable: true,
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        return {
            portData: [
                {
                    portId: 'chatModel',
                    dataType: 'chat-model',
                    inputValue: data.database.tables.modelConnection.ref(data.parameters.chatModel),
                },
            ],
        };
    }
}
