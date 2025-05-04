import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import { SQliteClient } from '../../sqlite/sqlite-client';
import { ModelConnectionType } from './model-connection.type';

export class ReferencedModelConnectionTable extends ReferencedSqliteTable<ModelConnectionType> {
    constructor(client: SQliteClient) {
        super('modelConnection', 'A connection to a AI model including the model name, API key, and other relevant information', client);
    }
}

export class ReferencedModelConnectionRecord extends ReferencedSqliteRecord<ModelConnectionType> {
    constructor(id: string, client: SQliteClient) {
        super('modelConnection', id, client);
    }
}
