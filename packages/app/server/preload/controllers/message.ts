import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface MessageRecord extends BaseRecord {
    threadId: string;
    type: string;
    sourceId: string;
    content: string;
}

class _MessageController extends BaseDatabaseConnection<MessageRecord> {
    constructor() {
        super('message', 'Individual messages in a thread with type, source, and content');
    }

    async findByThreadId(threadId: string): Promise<MessageRecord[]> {
        const result = await this.getTable().findMany({
            where: { threadId },
            orderBy: { createdAt: 'asc' },
        });
        return result as MessageRecord[];
    }
}

export const MessageController = new _MessageController();
