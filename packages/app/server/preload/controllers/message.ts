import { ChatMessagePartial } from '@abyss/intelligence';
import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface MessageRecord<T = ChatMessagePartial> extends BaseRecord {
    threadId: string;
    sourceId: string;
    content: T;
}

class _MessageController extends BaseDatabaseConnection<MessageRecord> {
    constructor() {
        super('message', 'Individual messages in a thread with type, source, and content');
    }

    async listByThreadId(threadId: string): Promise<MessageRecord[]> {
        const result = await this.getTable().findMany({
            where: { threadId },
            orderBy: { createdAt: 'asc' },
        });
        return result as MessageRecord[];
    }

    async addToThread(threadId: string, sourceId: string, content: ChatMessagePartial): Promise<MessageRecord> {
        const record = await this.create({
            threadId,
            sourceId,
            content,
        });
        return record as MessageRecord;
    }

    async addManyToThread(threadId: string, sourceId: string, contents: ChatMessagePartial[]): Promise<MessageRecord[]> {
        const records = await Promise.all(
            contents.map(content =>
                this.create({
                    threadId,
                    sourceId,
                    content,
                })
            )
        );
        return records as MessageRecord[];
    }
}
export const MessageController = new _MessageController();
