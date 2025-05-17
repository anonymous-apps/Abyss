import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import { randomId } from '../../utils/ids';
import type { NewToolDefinitionInput, ToolDefinitionType } from './tool-definition.type';

export class ReferencedToolDefinitionTable extends ReferencedSqliteTable<ToolDefinitionType> {
    constructor(client: SQliteClient) {
        super('toolDefinition', 'A definition of a tool that can be used in an agent workflow', client);
    }

    public ref(id: string) {
        return new ReferencedToolDefinitionRecord(id, this.client);
    }

    public newToolDefinition(input: NewToolDefinitionInput) {
        const shortName = `${input.name.toLowerCase().replace(/ /g, '-')}-${randomId()}`;
        return this.create({
            ...input,
            shortName,
        });
    }
}

export class ReferencedToolDefinitionRecord extends ReferencedSqliteRecord<ToolDefinitionType> {
    constructor(id: string, client: SQliteClient) {
        super('toolDefinition', id, client);
    }
}
