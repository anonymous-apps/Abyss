import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import { ReferencedMessageThreadRecord } from '../message-thread/message-thread';
import type { ReferencedMessageRecord } from '../message/message';
import type { ChatThreadType } from './chat-thread.type';

export class ReferencedChatThreadTable extends ReferencedSqliteTable<ChatThreadType> {
    constructor(client: SQliteClient) {
        super('chatThread', 'A thread of chat messages between participants', client);
    }

    public ref(id: string) {
        return new ReferencedChatThreadRecord(id, this.client);
    }

    public async new(sourceId: string) {
        const thread = await this.client.tables.messageThread.new();
        return await this.create({
            name: `New Chat Thread`,
            description: `New Chat Thread`,
            participantId: sourceId,
            threadId: thread.id,
        });
    }
}

export class ReferencedChatThreadRecord extends ReferencedSqliteRecord<ChatThreadType> {
    constructor(id: string, client: SQliteClient) {
        super('chatThread', id, client);
    }

    public async addMessages(...messages: ReferencedMessageRecord[]) {
        const thread = await this.getThread();
        const newThread = await thread.addMessages(...messages);
        await this.update({ threadId: newThread.id });
    }

    public async block(blockerId: string) {
        await this.update({ blockerId });
    }

    public async unblock() {
        await this.update({ blockerId: null });
    }

    public async setThread(thread: ReferencedMessageThreadRecord) {
        await this.update({ threadId: thread.id });
    }

    public async getThread() {
        const data = await this.get();
        return new ReferencedMessageThreadRecord(data.threadId, this.client);
    }
}
