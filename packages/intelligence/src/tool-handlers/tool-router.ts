import { ReferencedChatThreadRecord, SQliteClient, ToolCallRequestPartial, ToolDefinitionType } from '@abyss/records';
import { HelloWorldToolHandler } from './system/hello-world';

function getToolHandler(toolDefinition: ToolDefinitionType) {
    // If its one of ours
    if (toolDefinition.handlerType === 'abyss') {
        switch (toolDefinition.id) {
            case 'toolDefinition::helloworld-tool':
                return new HelloWorldToolHandler(toolDefinition);
            default:
                throw new Error(`No tool handler found for tool definition ${toolDefinition.id}`);
        }
    }

    throw new Error(`No tool handler found for tool definition ${toolDefinition.id}`);
}

export async function runUnproccessedToolCalls(chatRef: ReferencedChatThreadRecord, sqliteClient: SQliteClient) {
    const thread = await chatRef.getThread();
    const unprocessedToolCalls = await thread.getUnprocessedToolCalls();
    const messages = await Promise.all(Object.values(unprocessedToolCalls).map(call => call.get()));

    for (const toolCall of messages) {
        const toolCallData = toolCall as ToolCallRequestPartial;
        const toolDefinition = await sqliteClient.tables.toolDefinition.get(toolCallData.payloadData.toolId);
        const toolHandler = getToolHandler(toolDefinition);
        await toolHandler.execute(chatRef, toolCallData.payloadData, sqliteClient);
    }
}
