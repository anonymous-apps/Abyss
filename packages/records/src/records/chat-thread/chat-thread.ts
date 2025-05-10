import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import { SQliteClient } from '../../sqlite/sqlite-client';
import { NewRecord } from '../../sqlite/sqlite.type';
import { ReferencedMessageThreadRecord } from '../message-thread/message-thread';
import { ReferencedMessageRecord } from '../message/message';
import { MessageType } from '../message/message.type';
import { ChatThreadType } from './chat-thread.type';

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

    public async addMessagesByReference(...messages: ReferencedMessageRecord[]) {
        const data = await this.get();
        const messageThread = await this.client.tables.messageThread.get(data.threadId);
        const messageThreadRef = new ReferencedMessageThreadRecord(messageThread.id, this.client);
        const newThread = await messageThreadRef.addMessagesByReference(...messages);
        await this.update({ threadId: newThread.id });
    }

    public async addMessages(...messages: NewRecord<MessageType>[]) {
        const data = await this.get();
        const messageThread = await this.client.tables.messageThread.get(data.threadId);
        const messageThreadRef = new ReferencedMessageThreadRecord(messageThread.id, this.client);
        const newThread = await messageThreadRef.addMessages(...messages);
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
