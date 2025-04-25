import { GraphNodeDefinition } from '../../constructs/graphs/graph-node';
import { NodeExecutionResult, ResolveNodeData } from '../types';
import { NodeHandler } from './node-handler';

export class DebugInputNode extends NodeHandler {
    constructor() {
        super('debug-input');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Debug Input',
            color: '#000000',
            inputPorts: {},
            outputPorts: {
                output: {
                    id: 'output',
                    type: 'data',
                    dataType: 'string',
                    name: 'Output',
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
