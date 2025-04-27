import { PortTriggerData, StateMachineExecution } from '../../state-machine';
import { StateGraph } from '../../state-machine/graphs-objects/state-graph';
import { Log } from '../../utils/logs';
import { InvokeGraphParams } from './types';

export async function invokeGraph(options: InvokeGraphParams) {
    const { db, graphId, input } = options;
    Log.log('invokeGraph', `Invoking graph ${graphId}`);

    // Load the data
    const graph = await db.loadGraph(graphId);

    // Build the port trigger values
    const triggerValues: PortTriggerData[] = [];
    let inputNodeId: string | undefined;
    for (const node of graph.getNodes()) {
        if (node.type === 'on-chat-message' && options.input.type === 'onUserChat') {
            const chat = await db.loadChat(input.chatId);
            const thread = await chat.getThread();
            inputNodeId = node.id;
            const ports = node.inputPorts;
            for (const port of Object.values(ports)) {
                if (port.dataType === 'thread') {
                    triggerValues.push({
                        portId: port.id,
                        dataType: port.dataType,
                        inputValue: thread,
                    });
                }
                if (port.dataType === 'chat') {
                    triggerValues.push({
                        portId: port.id,
                        dataType: port.dataType,
                        inputValue: chat,
                    });
                }
            }
        }
    }

    // Ensure an input node was found
    if (!inputNodeId) {
        throw new Error('No input node found');
    }

    // Execute
    const stateGraph = new StateGraph(graph.getNodes(), graph.getConnections());
    const execution = new StateMachineExecution(graphId, stateGraph);
    await execution.invoke(inputNodeId, triggerValues);
}
