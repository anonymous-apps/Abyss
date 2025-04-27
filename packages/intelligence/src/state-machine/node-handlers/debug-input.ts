import { GraphNodeDefinition } from '../graphs-objects/graph-node';
import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../types';

export class DebugInputNode extends NodeHandler {
    constructor() {
        super('debug-input', 'trigger');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Debug Input',
            icon: 'debug',
            description: 'This node is used to debug the input of the node',
            color: '#000000',
            inputPorts: {},
            outputPorts: {
                output: {
                    id: 'output',
                    type: 'data',
                    dataType: 'string',
                    name: 'Output',
                    description: 'The output of the node',
                },
            },
        };
    }

    protected async _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        return {
            portData: [
                {
                    portId: 'output',
                    dataType: 'string',
                    inputValue: 'Hello, world!',
                },
            ],
        };
    }
}
