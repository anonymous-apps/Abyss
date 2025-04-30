import { Nodes, PortTriggerData, StateMachineExecution } from '../../state-machine';
import { InvokeGraphParams } from './types';

export async function invokeGraphHandler(options: InvokeGraphParams) {
    const { database, graphId, input } = options;

    // Load the data
    const graph = await database.table.agentGraph.getOrThrow(graphId);
    const graphExecution = await database.table.agentGraphExecution.new(graphId);

    // Port data
    const triggerValues: PortTriggerData<any>[] = [];
    let inputNodeId: string | undefined;

    // Find the event node we want to trigger
    const onChatMessageNode = graph.nodes.find(node => node.nodeId === 'on-chat-message');

    if (onChatMessageNode && input.type === 'onUserChat') {
        inputNodeId = onChatMessageNode.id;

        const chat = await database.table.chatThread.getOrThrow(input.chatId);
        const thread = await database.table.messageThread.getOrThrow(chat.threadId);
        const definition = Nodes.OnChatMessage.getDefinition();
        const ports = Object.values(definition.outputPorts);

        const threadPort = ports.find(port => port.dataType === 'thread');
        const chatPort = ports.find(port => port.dataType === 'chat');
        const messagePort = ports.find(port => port.dataType === 'string');

        if (threadPort) {
            triggerValues.push({
                portId: threadPort.id,
                dataType: threadPort.dataType,
                inputValue: thread,
            });
        }
        if (chatPort) {
            triggerValues.push({
                portId: chatPort.id,
                dataType: chatPort.dataType,
                inputValue: chat,
            });
        }
        if (messagePort) {
            triggerValues.push({
                portId: messagePort.id,
                dataType: messagePort.dataType,
                inputValue: input.message,
            });
        }
    }

    // Ensure an input node was found
    if (!inputNodeId) {
        throw new Error('No input node found');
    }

    // Execute
    const execution = new StateMachineExecution(graph, graphExecution, database);
    await execution.invoke(inputNodeId, triggerValues, input);
}
