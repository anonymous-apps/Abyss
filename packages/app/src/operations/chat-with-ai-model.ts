import { Operations } from '@abyss/intelligence';
import { Database } from '../main';

export async function chatWithAiModel(humanMessage: string, modelConnectionId: string, chatId: string) {
    const chat = await Database.table.chatThread.getOrThrow(chatId);
    const thread = await Database.table.messageThread.getOrThrow(chat.threadId);
    const updatedThread = await thread.addHumanPartial({
        type: 'text',
        payload: {
            content: humanMessage,
        },
    });
    await chat.setThreadId(updatedThread.id);
    await Operations.invokeModelDirectlyHandler({
        modelConnectionId,
        chatId,
        database: Database,
    });
}
