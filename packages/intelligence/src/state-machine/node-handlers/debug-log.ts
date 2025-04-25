import { GraphNodeDefinition } from '../../constructs/graphs/graph-node';
import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../types';

export class DebugLogNode extends NodeHandler {
    constructor() {
        super('debug-log');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Debug Log',
            description: 'This node is used to debug the log of the node',
            color: '#000000',
            inputPorts: {
                logInput: {
                    id: 'logInput',
                    type: 'signal',
                    dataType: 'string',
                    name: 'Message',
                    description: 'The message to log',
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
