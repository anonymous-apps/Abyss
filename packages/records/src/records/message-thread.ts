import { ReferencedSqliteRecord } from '../sqlite/reference-record';
import { ReferencedSqliteTable } from '../sqlite/reference-table';
import { SQliteClient } from '../sqlite/sqlite-client';
import { MessageThreadType } from './message-thread.types';

export class ReferencedMessageThreadTable extends ReferencedSqliteTable<MessageThreadType> {
    constructor(client: SQliteClient) {
        super('messageThread', 'A thread of messages with different types of content', client);
    }
}

export class ReferencedMessageThreadRecord extends ReferencedSqliteRecord<MessageThreadType> {}
