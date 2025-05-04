import { invokeModelAgainstThread } from '../../models/handler';
import { InvokeModelDirectlyParams } from './types';

export async function invokeModelDirectlyHandler(options: InvokeModelDirectlyParams) {
    const { database, modelConnectionId, chatId, humanMessage } = options;
    const chatRef = database.tables.chatThread.ref(chatId);

    try {
        // Add the human message to the chat
        await chatRef.addMessages({
            senderId: 'user',
            type: 'text',
            payloadData: {
                content: humanMessage,
            },
        });
        await chatRef.block(modelConnectionId);

        // Load the data
        const modelConnectionData = await database.tables.modelConnection.get(modelConnectionId);
        const chatData = await chatRef.get();
        const threadData = database.tables.messageThread.ref(chatData.threadId);

        // Invoke the model
        const response = await invokeModelAgainstThread(modelConnectionData, threadData);

        // Update the chat with the response
        await chatRef.addMessages({
            senderId: modelConnectionData.id,
            type: 'text',
            payloadData: {
                content: response.outputString,
            },
        });
    } catch (error) {
        console.error(error);
    } finally {
        await chatRef.unblock();
    }
}
