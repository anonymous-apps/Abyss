import { BaseDatabaseConnection, BaseRecord } from './_base';
import { MessageController, MessageRecord } from './message';

export interface MessageThreadRecord extends BaseRecord {
    lockingId?: string;
}

class _MessageThreadController extends BaseDatabaseConnection<MessageThreadRecord> {
    constructor() {
        super('messageThread', 'A collection representing a list of messages between a user and a model');
    }

    async addMessage(
        threadId: string,
        message: Omit<MessageRecord, 'id' | 'createdAt' | 'updatedAt' | 'threadId'>
    ): Promise<MessageRecord> {
        const result = await MessageController.create({ ...message, threadId });
        await this.notifyChange({ id: threadId });
        return result as MessageRecord;
    }

    async lockThread(threadId: string, lockingId: string): Promise<MessageThreadRecord> {
        return await this.update(threadId, {
            lockingId,
        });
    }

    async unlockThread(threadId: string): Promise<MessageThreadRecord> {
        return await this.update(threadId, {
            lockingId: undefined,
        });
    }
}

export const MessageThreadController = new _MessageThreadController();
