import { AgentController } from '../controllers/agent';
import { AgentToolConnectionController } from '../controllers/agent-tool-connection';
import { ChatController } from '../controllers/chat';
import { MessageController } from '../controllers/message';
import { MessageThreadController } from '../controllers/message-thread';
import { ModelConnectionsController } from '../controllers/model-connections';
import { NetworkCallController } from '../controllers/network-call';
import { RenderedConversationThreadController } from '../controllers/rendered-conversation-thread';
import { buildChatContext, buildIntelegence } from './utils';

export async function AskAgentToRespondToChat(chatId: string) {
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

    const agent = await AgentController.getByRecordId(chat.sourceId);
    if (!agent) {
        throw new Error('Agent unknown');
    }

    const connection = await ModelConnectionsController.getByRecordId(agent.chatModelId);
    if (!connection) {
        throw new Error('Connection unknown');
    }

    const tools = await AgentToolConnectionController.findByAgentId(agent.id);

    // Lock the chat
    await MessageThreadController.update(thread.id, {
        lockingJobId: '-',
    });

    try {
        // Get the AI
        const ai = await buildIntelegence(connection);
        const context = buildChatContext(messages);
        const response = await ai.askWithTools({
            context,
            tools: tools.map(tool => ({
                name: tool.tool.name,
                description: tool.tool.description,
                format: tool.tool.schema,
            })),
        });

        // Save the response into the database
        const message = await MessageController.create({
            threadId: thread.id,
            type: 'AI',
            sourceId: connection.id,
            content: response.response,
        });

        if (response.apiCall) {
            const apiCallRecord = await NetworkCallController.create({
                endpoint: response.apiCall.endpoint,
                method: response.apiCall.method,
                status: response.apiCall.status,
                body: JSON.stringify(response.apiCall.body, null, 2),
                response: JSON.stringify(response.apiCall?.response, null, 2),
            });
            await MessageController.update(message.id, {
                references: {
                    networkCallId: apiCallRecord.id,
                },
            });
        }

        if (response.chat) {
            const renderedThread = await RenderedConversationThreadController.create({
                messages: response.chat.getMessages() as any,
            });
            await MessageController.update(message.id, {
                references: {
                    renderedConversationThreadId: renderedThread.id,
                },
            });
        }

        // Update the chat to be unlocked
        await MessageThreadController.update(thread.id, {
            lockingJobId: '',
        });
    } catch (error) {
        const message = await MessageController.create({
            threadId: thread.id,
            type: 'INTERNAL',
            sourceId: 'SYSTEM',
            content: `An error occurred while asking the AI to respond to the chat: ${error}`,
        });
        await MessageThreadController.update(thread.id, {
            lockingJobId: '',
        });
    }
}
