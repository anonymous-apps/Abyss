import { invokeModelAgainstThread } from '../../models/handler';
import { InvokeModelDirectlyParams } from './types';

export async function invokeModelDirectlyHandler(options: InvokeModelDirectlyParams) {
    const { database, modelConnectionId, chatId } = options;

    // Load the data
    const modelConnection = await database.table.modelConnection.getOrThrow(modelConnectionId);
    const chat = await database.table.chatThread.getOrThrow(chatId);
    const thread = await database.table.messageThread.getOrThrow(chat.threadId);

    // Invoke the model
    const response = await invokeModelAgainstThread(modelConnection, thread);

    // Update the chat with the response
    const updatedThread = await thread.addPartial(modelConnection.id, {
        type: 'text',
        payload: {
            content: response.outputString,
        },
    });
    await chat.setThreadId(updatedThread.id);
}
