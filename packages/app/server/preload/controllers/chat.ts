import { BaseDatabaseConnection, BaseRecord } from './_base';
import { prisma } from '../database-connection';
import { MessageThreadController } from './message-thread';
export interface ChatRecord extends BaseRecord {
    name: string;
    description: string;
    type: string;
    sourceId: string;
    modelConnectionId?: string;
}

class _ChatController extends BaseDatabaseConnection<ChatRecord> {
    constructor() {
        super('chat', 'A user-interactable construct which allows you to have a conversation with a target');
    }

    async createWithThread(chatData: Omit<ChatRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChatRecord> {
        const thread = await MessageThreadController.create({});

        const chat = await this.create({
            ...chatData,
            references: { ...chatData.references, threadId: thread.id },
        });

        await this.notifyChange({ id: thread.id });
        return chat;
    }
}

export const ChatController = new _ChatController();
