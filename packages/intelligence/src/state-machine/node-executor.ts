import { NodeHandler } from './node-handlers/node-handler';
import { NodeExecutionResult, ResolveNodeData } from './types';

export async function resolveNode(data: ResolveNodeData): Promise<NodeExecutionResult> {
    const inputPorts = data.node.inputPorts;

    inputPorts.forEach(inputPort => {
        const input = data.portData.find(p => p.portId === inputPort.id);
        if (!input) {
            throw new Error(`Port ${inputPort.id} didnt have any input data`);
        }
        if (input.inputValue !== inputPort.dataType) {
            throw new Error(`Port ${inputPort.id} has the wrong data type`);
        }
    });

    const handler = NodeHandler.getHandler(data.node);
    return await handler.resolve(data);
}
