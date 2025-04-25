import { GraphNodeDefinition } from '../../constructs/graphs/graph-node';
import { NodeExecutionResult, ResolveNodeData } from '../types';
import { NodeHandler } from './node-handler';

export class DebugLogNode extends NodeHandler {
    constructor() {
        super('debug-log');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Debug Log',
            color: '#000000',
            inputPorts: {
                logInput: {
                    id: 'logInput',
                    type: 'signal',
                    dataType: 'string',
                    name: 'Message',
                },
            },
            outputPorts: {},
        };
    }

    protected _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        const logInput = data.portData.find(p => p.portId === 'logInput');
        if (!logInput) {
            throw new Error('Log input port not found');
        }
        console.log(logInput.inputValue);
        return Promise.resolve({
            portData: [],
        });
    }
}
