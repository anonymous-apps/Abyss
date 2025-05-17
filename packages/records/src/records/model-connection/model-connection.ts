import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import type { ModelConnectionType } from './model-connection.type';

export class ReferencedModelConnectionTable extends ReferencedSqliteTable<ModelConnectionType> {
    constructor(client: SQliteClient) {
        super('modelConnection', 'A connection to a AI model including the model name, API key, and other relevant information', client);
    }

    public ref(id: string) {
        return new ReferencedModelConnectionRecord(id, this.client);
    }
}

export class ReferencedModelConnectionRecord extends ReferencedSqliteRecord<ModelConnectionType> {
    constructor(id: string, client: SQliteClient) {
        super('modelConnection', id, client);
    }
}
