import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { ChatThreadRecord } from './chatThread';
import { ChatThreadType } from './chatThread.type';

export class ChatThreadController extends RecordController<'chatThread', ChatThreadType, ChatThreadRecord> {
    constructor(connection: PrismaConnection) {
        super(
            'chatThread',
            'A pointer to a message thread representing an ongoing conversation between two participants',
            connection,
            data => new ChatThreadRecord(this, data)
        );
    }

    async new(participantId: string): Promise<ChatThreadRecord> {
        const messageThread = await this.connection.table.messageThread.create({
            turns: [],
        });
        const result = await this.connection.table.chatThread.create({
            name: 'New Chat Thread',
            description: 'New Chat Thread',
            threadId: messageThread.id,
            participantId,
        });
        this.connection.notifyRecord(this.recordType, result);
        this.connection.notifyRecord('messageThread', messageThread);
        return new ChatThreadRecord(this, result as unknown as ChatThreadType);
    }
}
