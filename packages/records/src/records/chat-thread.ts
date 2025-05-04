import { ReferencedSqliteRecord } from '../sqlite/reference-record';
import { ReferencedSqliteTable } from '../sqlite/reference-table';
import { SQliteClient } from '../sqlite/sqlite-client';
import { ChatThreadType } from './chat-thread.types';
import { MessagePartial } from './message-thread.types';

export class ReferencedChatThreadTable extends ReferencedSqliteTable<ChatThreadType> {
    constructor(client: SQliteClient) {
        super('chatThread', 'A thread of chat messages between participants', client);
    }
}

export class ReferencedChatThreadRecord extends ReferencedSqliteRecord<ChatThreadType> {
    public async addPartial(senderId: string, ...messages: Omit<MessagePartial, 'timestamp'>[]) {
        const data = await this.get();
        const messageThread = await this.client.tables.messageThread.get(data.threadId);
    }
}
