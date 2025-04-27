import { PortTriggerData, StateMachineExecution } from '../../state-machine';
import { InvokeGraphParams } from './types';

export async function invokeGraphHandler(options: InvokeGraphParams) {
    const { db, graphId, input } = options;

    // Load the data
    const graph = await db.loadGraph(graphId);

    // Build the port trigger values
    const triggerValues: PortTriggerData<any>[] = [];
    let inputNodeId: string | undefined;
    for (const node of graph.getNodes()) {
        if (node.type === 'on-chat-message' && options.input.type === 'onUserChat') {
            const chat = await db.loadChat(input.chatId);
            const thread = await chat.getThread();
            inputNodeId = node.id;
            const ports = node.outputPorts;
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
    const execution = new StateMachineExecution(graphId, db, graph);
    await execution.invoke(inputNodeId, triggerValues);
}
