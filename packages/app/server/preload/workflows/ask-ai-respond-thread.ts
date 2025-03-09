import { ChatController } from '../controllers/chat';
import { MessageController } from '../controllers/message';
import { MessageThreadController } from '../controllers/message-thread';
import { buildChatContext, buildIntelegenceForChat } from './utils';
import { ModelConnectionController } from '../controllers/model-connections';
import { ApiCallController } from '../controllers/api-call';
import { RenderedThreadController } from '../controllers/rendered-thread';

export async function AskAiToRespondToChat(chatId: string) {
    const chat = await ChatController.getByRecordId(chatId);
    if (!chat) {
        throw new Error('Chat unknown');
    }

    const thread = await MessageThreadController.getByRecordId(chat?.threadId);
    if (!thread) {
        throw new Error('Thread unknown');
    }

    const messages = await MessageController.forThread(thread.id);
    if (!messages) {
        throw new Error('Thread unknown');
    }

    const connection = await ModelConnectionController.getByRecordId(chat.assistantId);
    if (!connection) {
        throw new Error('Connection unknown');
    }

    // Lock the chat
    await MessageThreadController.update(thread.id, {
        status: 'responding',
    });

    try {
        // Get the AI
        const ai = await buildIntelegenceForChat(chat, connection);
        const context = buildChatContext(messages);
        const response = await ai.respond({ context });

        // Save the response into the database
        const message = await MessageController.create({
            threadId: thread.id,
            role: 'AI',
            source: connection.id,
            content: response.response,
        });

        if (response.apiCall) {
            const apiCallRecord = await ApiCallController.create({
                endpoint: response.apiCall.endpoint,
                method: response.apiCall.method,
                status: response.apiCall.status,
                body: response.apiCall.body,
                response: response.apiCall?.response,
            });
            await MessageController.update(message.id, {
                apiCallId: apiCallRecord.id,
            });
        }

        if (response.chat) {
            const renderedThread = await RenderedThreadController.create({
                messages: response.chat.getMessages() as any,
            });
            await MessageController.update(message.id, {
                renderedId: renderedThread.id,
            });
        }

        // Update the chat to be unlocked
        await MessageThreadController.update(thread.id, {
            status: 'active',
        });
    } catch (error) {
        const message = await MessageController.create({
            threadId: thread.id,
            role: 'INTERNAL',
            source: 'SYSTEM',
            content: `An error occurred while asking the AI to respond to the chat: ${error}`,
        });
        await MessageThreadController.update(thread.id, {
            status: 'active',
        });
    }
}
