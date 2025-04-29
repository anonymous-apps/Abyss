import { NodeHandler } from '../node-handler';
import { NodeExecutionResult, ResolveNodeData } from '../type-base.type';
import { GraphNodeDefinition } from '../type-definition.type';

export class DebugLogNode extends NodeHandler {
    constructor() {
        super('debug-log', 'dynamic');
    }

    protected _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'> {
        return {
            name: 'Debug Log',
            icon: 'debug',
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
        return Promise.resolve({
            portData: [],
        });
    }
}
