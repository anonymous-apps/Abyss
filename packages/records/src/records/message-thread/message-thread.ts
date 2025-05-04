import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import { SQliteClient } from '../../sqlite/sqlite-client';
import { NewRecord } from '../../sqlite/sqlite.type';
import { ReferencedMessageRecord } from '../message/message';
import { MessageType } from '../message/message.type';
import { MessageThreadType } from './message-thread.type';

export class ReferencedMessageThreadTable extends ReferencedSqliteTable<MessageThreadType> {
    constructor(client: SQliteClient) {
        super('messageThread', 'A thread of messages with different types of content', client);
    }
}

export class ReferencedMessageThreadRecord extends ReferencedSqliteRecord<MessageThreadType> {
    constructor(id: string, client: SQliteClient) {
        super('messageThread', id, client);
    }

    public async addMessagesByReference(...messages: ReferencedMessageRecord[]) {
        const clone = await this.clone();
        const clonedData = await clone.get();
        const newMessages = [...clonedData.messagesData, ...messages.map(m => ({ id: m.id }))];
        await clone.update({ messagesData: newMessages });
        return clone;
    }

    public async addMessages(...messages: NewRecord<MessageType>[]) {
        const newMessages = await this.client.tables.message.createMany(messages);
        const refs = newMessages.map(m => new ReferencedMessageRecord(m.id, this.client));
        return this.addMessagesByReference(...refs);
    }
}
