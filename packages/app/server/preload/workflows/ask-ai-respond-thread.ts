import { streamWithTools } from '@abyss/intelligence';
import { AgentController, AgentRecord } from '../controllers/agent';
import { ChatController, ChatRecord } from '../controllers/chat';
import { MessageController, MessageRecord } from '../controllers/message';
import { MessageThreadController, MessageThreadRecord } from '../controllers/message-thread';
import { ModelConnectionsController, ModelConnectionsRecord } from '../controllers/model-connections';
import { RenderedConversationThreadController } from '../controllers/rendered-conversation-thread';
import { ResponseStreamController, ResponseStreamRecord } from '../controllers/response-stream';
import { ToolInvocationController } from '../controllers/tool-invocation';
import { buildIntelegence, buildThread, buildToolDefinitionsForAgent } from './utils';

interface AskAiToRespondToChatData {
    chat: ChatRecord;
    thread: MessageThreadRecord;
    messages: MessageRecord[];
    connection: ModelConnectionsRecord;
    agent: AgentRecord | null;
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

    let agent = await AgentController.getByRecordId(chat.sourceId);
    let connection = await ModelConnectionsController.getByRecordId(chat.sourceId);

    if (!connection && agent) {
        connection = await ModelConnectionsController.getByRecordId(agent.chatModelId);
    }
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
        return await askAiToRespondToChat({ chat, thread, messages, connection, responseStream, agent });
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
    const toolDefinitions = data.agent ? await buildToolDefinitionsForAgent(data.agent) : [];

    // Start the stream
    const stream = await streamWithTools({ model, thread, toolDefinitions });

    // Emit messages as they come in
    const renderedThread = await RenderedConversationThreadController.create({
        messages: [],
    });

    // Save messages we have gotten so far
    const seenMessages: Record<string, MessageRecord> = {};
    const seen = new Set<string>();

    stream.onNewTextMessage(async message => {
        // Check if we have already seen this message, create it if we haven't
        if (!seen.has(message.uuid)) {
            seen.add(message.uuid);
            const targetMessageRecord = await MessageController.create({
                threadId: data.thread.id,
                type: 'AI',
                sourceId: data.responseStream.id,
                content: message.content,
                references: {
                    renderedConversationThreadId: renderedThread.id,
                },
            });
            ResponseStreamController.addMessage(data.responseStream.id, message);
            seenMessages[message.uuid] = targetMessageRecord;
            seen.add(message.uuid);
        }

        const targetMessageRecord = seenMessages[message.uuid];
        if (!targetMessageRecord) {
            return;
        }

        // Update the message record
        ResponseStreamController.updateRawOutput(data.responseStream.id, stream.getRawOutput());
        await MessageController.update(targetMessageRecord.id, {
            content: message.content,
        });
    });

    stream.onNewToolCall(async message => {
        ResponseStreamController.addMessage(data.responseStream.id, message);
        ResponseStreamController.updateRawOutput(data.responseStream.id, stream.getRawOutput());
        const toolController = await ToolInvocationController.create({
            toolId: message.callId,
            parameters: message.arguments,
            status: 'waiting',
        });
        const toolMessage = await MessageController.create({
            threadId: data.thread.id,
            type: 'TOOL',
            sourceId: data.responseStream.id,
            content: '',
            references: {
                toolInvocationId: toolController.id,
            },
        });
    });

    stream.onToolCallCompleted(message => {
        ResponseStreamController.updateRawOutput(data.responseStream.id, stream.getRawOutput());
        ToolInvocationController.update(message.callId, {
            parameters: message.arguments,
        });
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

    // Capture result thread
    const resultMessage = stream.getRawOutput();
    const resultThread = stream.inputThread.addBotTextMessage(resultMessage);
    await RenderedConversationThreadController.update(renderedThread.id, {
        messages: resultThread.serialize(),
    });
}
