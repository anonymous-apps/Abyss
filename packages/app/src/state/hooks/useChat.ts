import { MessageThread } from '@prisma/client';
import { useDatabaseTableSubscription } from '../database-connection';

export function useChatWithModel(chatId: string) {
    // The chat record
    const chat = useDatabaseTableSubscription(
        'Chat',
        async database => {
            const chat = await database.table.chat.findUnique(chatId);
            return chat;
        },
        [chatId]
    );

    // The thread record for the chat
    const _getThread = async database => {
        if (chat.data?.threadId) {
            const thread = await database.table.messageThread.findUnique(chat.data?.threadId || '');
            return thread;
        }
    };
    const thread = useDatabaseTableSubscription<MessageThread>('MessageThread', _getThread, [chat.data?.threadId]);

    // The messages for the thread
    const _getMessages = async database => {
        if (thread.data?.id) {
            const messages = await database.table.message.forThread(thread.data?.id || '');
            return messages;
        }
    };
    const messages = useDatabaseTableSubscription('Message', _getMessages, [thread.data?.id]);

    // The model for the chat
    const _getModel = async database => {
        const model = await database.table.modelConnections.findUnique(chat.data?.assistantId || '');
        return model;
    };
    const model = useDatabaseTableSubscription('ModelConnections', _getModel, [chat.data?.assistantId]);

    if (chat.loading || thread.loading || messages.loading || model.loading) {
        return {
            loading: true,
        };
    }

    return {
        loading: false,
        chat: chat.data,
        thread: thread.data,
        messages: messages.data,
        model: model.data,
    };
}
