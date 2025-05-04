import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import { SQliteClient } from '../../sqlite/sqlite-client';
import { MessageType } from './message.type';

export class ReferencedMessageTable extends ReferencedSqliteTable<MessageType> {
    constructor(client: SQliteClient) {
        super('message', 'A message in which belongs to a message thread', client);
    }
}

export class ReferencedMessageRecord extends ReferencedSqliteRecord<MessageType> {
    constructor(id: string, client: SQliteClient) {
        super('message', id, client);
    }
}
