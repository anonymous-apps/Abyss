import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';

describe('Tool Definition Table Reference', () => {
    test('when we create a new tool definition, we should be able to get a reference to it through table.ref(id)', async () => {
        const client = await buildCleanDB();
        const toolDefinition = await client.tables.toolDefinition.newToolDefinition({
            name: 'test',
            description: 'test',
            handlerType: 'abyss',
            inputSchemaData: [],
            outputSchemaData: [],
        });
        const ref = client.tables.toolDefinition.ref(toolDefinition.id);
        const result = await ref.get();
        expect(result.name).toEqual('test');
    });
    test('when we create a new tool definition, it will infer the shortName from the name', async () => {
        const client = await buildCleanDB();
        const toolDefinition = await client.tables.toolDefinition.newToolDefinition({
            name: 'Test tool definition',
            description: 'test',
            handlerType: 'abyss',
            inputSchemaData: [],
            outputSchemaData: [],
        });
        expect(toolDefinition.shortName).toContain('test-tool-definition-');
    });
});
