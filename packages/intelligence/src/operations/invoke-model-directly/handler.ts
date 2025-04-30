import { invokeModelAgainstThread } from '../../models/handler';
import { InvokeModelDirectlyParams } from './types';

export async function invokeModelDirectlyHandler(options: InvokeModelDirectlyParams) {
    const { database, modelConnectionId, chatId, humanMessage } = options;
    const chatRef = database.table.chatThread.ref(chatId);

    try {
        // Add the human message to the chat
        await chatRef.addHumanPartial({
            type: 'text',
            payload: {
                content: humanMessage,
            },
        });
        await chatRef.block(modelConnectionId);

        // Load the data
        const modelConnectionData = await database.table.modelConnection.getOrThrow(modelConnectionId);
        const chatData = await chatRef.getOrThrow();
        const threadData = await database.table.messageThread.getOrThrow(chatData.threadId);

        // Invoke the model
        const response = await invokeModelAgainstThread(modelConnectionData, threadData);

        // Update the chat with the response
        await chatRef.addPartial(modelConnectionData.id, {
            type: 'text',
            payload: {
                content: response.outputString,
            },
        });
    } catch (error) {
        console.error(error);
    } finally {
        await chatRef.unblock();
    }
}
