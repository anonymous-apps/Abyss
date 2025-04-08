import { streamWithTools } from '@abyss/intelligence';
import { ChatController, ChatRecord } from '../controllers/chat';
import { MessageController, MessageRecord } from '../controllers/message';
import { MessageThreadController, MessageThreadRecord } from '../controllers/message-thread';
import { ModelConnectionsController, ModelConnectionsRecord } from '../controllers/model-connections';
import { ResponseStreamController, ResponseStreamRecord } from '../controllers/response-stream';
import { buildIntelegence, buildThread } from './utils';

interface AskAiToRespondToChatData {
    chat: ChatRecord;
    thread: MessageThreadRecord;
    messages: MessageRecord[];
    connection: ModelConnectionsRecord;
    responseStream: ResponseStreamRecord;
}

export async function AskAiToRespondToChat(chatId: string) {
    const chat = await ChatController.getByRecordId(chatId);
    if (!chat) {
        throw new Error('Chat unknown');
    }

    const thread = await MessageThreadController.getByRecordId(chat?.threadId);
    if (!thread) {
        throw new Error('Thread unknown');
    }

    const messages = await MessageController.findByThreadId(thread.id);
    if (!messages) {
        throw new Error('Thread unknown');
    }

    const connection = await ModelConnectionsController.getByRecordId(chat.sourceId);
    if (!connection) {
        throw new Error('Connection unknown');
    }

    // Create the response stream object
    const responseStream = await ResponseStreamController.create({
        sourceId: connection.id,
        resultMessages: [],
        status: 'streaming',
        rawOutput: '',
    });

    // Lock the chat
    await MessageThreadController.update(thread.id, {
        lockingId: responseStream.id,
    });

    try {
        return await askAiToRespondToChat({ chat, thread, messages, connection, responseStream });
    } catch (error) {
        await ResponseStreamController.update(responseStream.id, {
            status: 'error',
        });
        throw error;
    } finally {
        await MessageThreadController.update(thread.id, {
            lockingId: '',
        });
    }
}

async function askAiToRespondToChat(data: AskAiToRespondToChatData) {
    // Get the AI
    const model = await buildIntelegence(data.connection);
    const thread = buildThread(data.messages);

    const toolDefinitions = [];

    // Start the stream
    const stream = await streamWithTools({ model, thread, toolDefinitions });

    stream.onNewMessage(message => {
        ResponseStreamController.addMessage(data.responseStream.id, message);
        ResponseStreamController.updateRawOutput(data.responseStream.id, stream.getRawOutput());
    });

    stream.onComplete(() => {
        ResponseStreamController.update(data.responseStream.id, {
            resultMessages: stream.getMessages(),
            status: 'complete',
            rawOutput: stream.getRawOutput(),
        });
    });

    // Wait for the stream to complete
    await stream.waitForCompletion();

    // Save the response into the database as messages after stream is complete
    const messages = stream.getMessages();
    for (const message of messages) {
        if (message.type === 'text') {
            await MessageController.create({
                threadId: data.thread.id,
                type: 'AI',
                sourceId: data.responseStream.id,
                content: message.content,
                references: {
                    renderedConversationThreadId: data.thread.id,
                },
            });
        }
        if (message.type === 'toolCall') {
            await MessageController.create({
                threadId: data.thread.id,
                type: 'TOOL',
                sourceId: data.responseStream.id,
                content: JSON.stringify({
                    callId: message.callId,
                    name: message.name,
                    arguments: message.arguments,
                }),
                references: {
                    renderedConversationThreadId: data.thread.id,
                },
            });
        }
    }
}
