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

    public ref(id: string) {
        return new ReferencedMessageThreadRecord(id, this.client);
    }

    public async new() {
        return await this.create({ messagesData: [] });
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

    public async getTurns() {
        const data = await this.get();
        const refs = data.messagesData.map(m => new ReferencedMessageRecord(m.id, this.client));
        const messages = await Promise.all(refs.map(r => r.get()));

        const turns: {
            senderId: string;
            messages: MessageType[];
        }[] = [];

        for (const message of messages) {
            const lastTurn = turns.length === 0 ? '' : turns[turns.length - 1].senderId;
            if (message.senderId === lastTurn) {
                turns[turns.length - 1].messages.push(message);
            } else {
                turns.push({
                    senderId: message.senderId,
                    messages: [message],
                });
            }
        }
        return turns;
    }
}
