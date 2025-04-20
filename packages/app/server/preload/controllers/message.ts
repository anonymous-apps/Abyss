import { BaseDatabaseConnection, BaseRecord } from './_base';

export type MessageText = {
    text: string;
};

export type MessageToolCall = {
    tool: {
        toolId?: string;
        name: string;
        parameters: Record<string, any>;
        invocationId?: string;
    };
};

export interface MessageRecord<T = MessageText | MessageToolCall> extends BaseRecord {
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
}

export const MessageController = new _MessageController();
