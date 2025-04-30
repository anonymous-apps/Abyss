import { invokeModelAgainstThread } from '../../models/handler';
import { InvokeModelDirectlyParams } from './types';

export async function invokeModelDirectlyHandler(options: InvokeModelDirectlyParams) {
    const { database, modelConnectionId, chatId, humanMessage } = options;
    const chatRecord = await database.table.chatThread.getOrThrow(chatId);

    try {
        // Add the human message to the chat
        await chatRecord.addHumanPartial({
            type: 'text',
            payload: {
                content: humanMessage,
            },
        });
        await chatRecord.block(modelConnectionId);

        // Load the data
        const modelConnection = await database.table.modelConnection.getOrThrow(modelConnectionId);
        const thread = await database.table.messageThread.getOrThrow(chatRecord.threadId);

        // Invoke the model
        const response = await invokeModelAgainstThread(modelConnection, thread);

        // Update the chat with the response
        await chatRecord.addPartial(modelConnection.id, {
            type: 'text',
            payload: {
                content: response.outputString,
            },
        });
    } catch (error) {
        console.error(error);
    } finally {
        await chatRecord.unblock();
    }
}
