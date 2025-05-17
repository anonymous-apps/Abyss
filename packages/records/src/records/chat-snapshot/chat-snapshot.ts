import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import type { ChatSnapshot } from './chat-snapshot.type';

export class ReferencedChatSnapshotTable extends ReferencedSqliteTable<ChatSnapshot> {
    constructor(client: SQliteClient) {
        super('chatSnapshot', 'A point in time record of a conversation as it was serialized for an LLM', client);
    }

    public ref(id: string) {
        return new ReferencedChatSnapshotRecord(id, this.client);
    }
}

export class ReferencedChatSnapshotRecord extends ReferencedSqliteRecord<ChatSnapshot> {
    constructor(id: string, client: SQliteClient) {
        super('chatSnapshot', id, client);
    }
}
