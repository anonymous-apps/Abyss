import { AgentRecord } from '../../../server/preload/controllers/agent';
import { ChatRecord } from '../../../server/preload/controllers/chat';
import { MessageRecord } from '../../../server/preload/controllers/message';
import { MessageThreadRecord } from '../../../server/preload/controllers/message-thread';
import { ModelConnectionsRecord } from '../../../server/preload/controllers/model-connections';
import { useDatabaseTableSubscription } from '../database-connection';

export function useChatData(chatId: string) {
    // The chat record
    const chat = useDatabaseTableSubscription(
        'Chat',
        async database => {
            const chat = await database.table.chat.findById(chatId);
            return chat;
        },
        [chatId]
    );

    // The thread record for the chat
    const thread = useDatabaseTableSubscription(
        'MessageThread',
        async database => {
            if (chat.data?.threadId) {
                const thread = await database.table.messageThread.findById(chat.data?.threadId || '');
                return thread;
            }
        },
        [chat.data?.threadId]
    );

    // The messages for the thread
    const messages = useDatabaseTableSubscription(
        'Message',
        async database => {
            if (thread.data?.id) {
                const messages = await database.table.message.listByThreadId(thread.data?.id || '');
                return messages;
            }
        },
        [thread.data?.id]
    );

    // The agent for the chat if this is an agent chat
    const agent = useDatabaseTableSubscription(
        'Agent',
        async database => {
            const id = chat.data?.references?.sourceId;
            const agent = await database.table.agent.findById(id || '');
            return agent;
        },
        [chat.data?.references?.sourceId]
    );

    // The model for the chat
    const model = useDatabaseTableSubscription(
        'ModelConnections',
        async database => {
            const id = chat.data?.references?.sourceId;
            const model = await database.table.modelConnections.findById(id || '');
            return model;
        },
        [chat.data?.references?.sourceId]
    );

    if (chat.loading || thread.loading || messages.loading || model.loading || agent.loading) {
        return {
            loading: true as true,
        };
    }

    return {
        loading: false as false,
        chat: chat.data as ChatRecord,
        thread: thread.data as MessageThreadRecord,
        messages: messages.data as MessageRecord[],
        model: model.data as ModelConnectionsRecord | undefined,
        agent: agent.data as AgentRecord | undefined,
    };
}
