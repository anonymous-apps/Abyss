import {
    ReferencedChatThreadRecord,
    ReferencedMessageRecord,
    SQliteClient,
    ToolCallRequestPartial,
    ToolDefinitionType,
} from '@abyss/records';
import { HelloWorldToolHandler } from './system/hello-world';
import { LabelChatToolHandler } from './system/label-chat';

function getToolHandler(toolDefinition: ToolDefinitionType) {
    // If its one of ours
    if (toolDefinition.handlerType === 'abyss') {
        switch (toolDefinition.id) {
            case 'toolDefinition::helloworld-tool':
                return new HelloWorldToolHandler(toolDefinition);
            case 'toolDefinition::labelchat-tool':
                return new LabelChatToolHandler(toolDefinition);
            default:
                throw new Error(`No tool handler found for tool definition ${toolDefinition.id}`);
        }
    }

    throw new Error(`No tool handler found for tool definition ${toolDefinition.id}`);
}

export async function runUnproccessedToolCalls(chatRef: ReferencedChatThreadRecord, sqliteClient: SQliteClient) {
    const thread = await chatRef.getThread();
    const unprocessedToolCalls = await thread.getUnprocessedToolCalls();
    const activeToolDefinitions = await thread.getAllActiveToolDefinitions();
    const messages = await Promise.all(Object.values(unprocessedToolCalls).map(call => call.get()));

    for (const toolCall of messages) {
        const toolCallData = toolCall as ToolCallRequestPartial;
        try {
            const activeToolDefinition = activeToolDefinitions.find(t => t.id === toolCallData.payloadData.toolId);
            if (!activeToolDefinition) {
                throw new Error(
                    `Tool definition ${toolCallData.payloadData.toolId} not found in the current context, it either doesnt exist or was removed.`
                );
            }
            const toolDefinition = await sqliteClient.tables.toolDefinition.get(toolCallData.payloadData.toolId);
            const toolHandler = getToolHandler(toolDefinition);
            await toolHandler.execute(chatRef, toolCallData.payloadData, sqliteClient);
        } catch (error) {
            const messageRecord = await chatRef.client.tables.message.create({
                type: 'tool-call-response',
                payloadData: {
                    toolCallId: toolCallData.payloadData.toolCallId,
                    shortName: toolCallData.payloadData.shortName,
                    status: 'failed',
                    result: (error as Error).message,
                },
                senderId: 'system',
            });
            await chatRef.addMessages(new ReferencedMessageRecord(messageRecord.id, chatRef.client));
        }
    }
}
