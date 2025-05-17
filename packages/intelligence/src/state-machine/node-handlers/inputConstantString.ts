import { NodeHandler } from '../node-handler';
import type { NodeExecutionResult, ResolveNodeData } from '../type-base.type';
import type { GraphNodeDefinition } from '../type-definition.type';

export class InputConstantStringNode extends NodeHandler {
    constructor() {
        super('input-constant-string', 'static');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Constant String',
            icon: 'text',
            description: 'A constant string value',
            color: '#515151',
            inputPorts: {},
            parameters: {},
            outputPorts: {
                constantString: {
                    id: 'constantString',
                    type: 'data',
                    dataType: 'string',
                    name: 'Constant String',
                    description: 'A string value',
                    userConfigurable: true,
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        return {
            portData: [
                {
                    portId: 'constantString',
                    dataType: 'string',
                    inputValue: data.parameters.constantString,
                },
            ],
        };
    }
}
