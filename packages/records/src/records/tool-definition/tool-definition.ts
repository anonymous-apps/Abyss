import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import type { ToolDefinitionType } from './tool-definition.type';

export class ReferencedToolDefinitionTable extends ReferencedSqliteTable<ToolDefinitionType> {
    constructor(client: SQliteClient) {
        super('toolDefinition', 'A definition of a tool that can be used in an agent workflow', client);
    }

    public ref(id: string) {
        return new ReferencedToolDefinitionRecord(id, this.client);
    }
}

export class ReferencedToolDefinitionRecord extends ReferencedSqliteRecord<ToolDefinitionType> {
    constructor(id: string, client: SQliteClient) {
        super('toolDefinition', id, client);
    }
}
