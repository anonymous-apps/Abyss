import { ReferencedSqliteRecord } from '../sqlite/reference-record';
import { ReferencedSqliteTable } from '../sqlite/reference-table';
import { SQliteClient } from '../sqlite/sqlite-client';
import { BaseSqliteRecord } from '../sqlite/sqlite.type';

export type ModelConnectionAccessFormat = 'gemini' | 'openai' | 'anthropic' | 'static';

export interface ModelConnectionType extends BaseSqliteRecord {
    name: string;
    description: string;
    accessFormat: ModelConnectionAccessFormat;
    providerId: string;
    modelId: string;
    data: any;
}

export class ReferencedModelConnectionTable extends ReferencedSqliteTable<ModelConnectionType> {
    constructor(client: SQliteClient) {
        super('modelConnection', 'A connection to a AI model including the model name, API key, and other relevant information', client);
    }
}

export class ReferencedModelConnectionRecord extends ReferencedSqliteRecord<ModelConnectionType> {}
