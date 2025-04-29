import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { ChatThreadRecord } from './chatThread';
import { ChatThreadType } from './chatThread.type';

export class ChatThreadController extends RecordController<ChatThreadType, ChatThreadRecord> {
    constructor(connection: PrismaConnection) {
        super('chatThread', connection, data => new ChatThreadRecord(this, data));
    }

    async new(participantId: string): Promise<ChatThreadRecord> {
        const messageThread = await this.connection.client.messageThread.create({
            data: {
                turns: [],
            },
        });
        const result = await this.connection.client.chatThread.create({
            data: {
                name: 'New Chat Thread',
                description: 'New Chat Thread',
                threadId: messageThread.id,
                participantId,
            },
        });
        this.connection.notifyRecord(this.recordType, result);
        this.connection.notifyRecord('messageThread', messageThread);
        return new ChatThreadRecord(this, result as unknown as ChatThreadType);
    }
}
