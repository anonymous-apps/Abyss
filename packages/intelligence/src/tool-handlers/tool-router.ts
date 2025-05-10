import { ReferencedChatThreadRecord, SQliteClient, ToolDefinitionType } from '@abyss/records';
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
    const chat = await chatRef.get();
    const thread = await chatRef.getThread();
    const unprocessedToolCalls = await thread.getUnprocessedToolCalls();

    for (const toolCall of unprocessedToolCalls) {
        const toolDefinition = await sqliteClient.tables.toolDefinition.get(toolCall.payloadData.toolId);
        const toolHandler = getToolHandler(toolDefinition);
        await toolHandler.execute(chatRef, toolCall.payloadData, sqliteClient);
    }
}
