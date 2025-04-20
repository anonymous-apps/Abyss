import { BaseDatabaseConnection, BaseRecord } from './_base';
import { MessageThreadController } from './message-thread';
export interface ChatRecord extends BaseRecord {
    name: string;
    threadId: string;
}

class _ChatController extends BaseDatabaseConnection<ChatRecord> {
    constructor() {
        super('chat', 'A user-interactable construct which allows you to have a conversation with a target');
    }

    async createWithThread(chatData: Omit<ChatRecord, 'id' | 'createdAt' | 'updatedAt' | 'threadId'>): Promise<ChatRecord> {
        const thread = await MessageThreadController.create({});
        const chat = await this.create({ ...chatData, threadId: thread.id });
        return chat;
    }

    async nameChat(chatId: string, name: string): Promise<void> {
        await this.update(chatId, { name });
    }
}

export const ChatController = new _ChatController();
