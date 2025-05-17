import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';

describe('ModelConnection::create', () => {
    test('Happy: Create model connection record', async () => {
        const client = await buildCleanDB();
        const modelConnection = await client.tables.modelConnection.create({
            id: 'model-connection::test',
            name: 'Test Model Connection',
            description: 'A test model connection',
            accessFormat: 'openai',
            providerId: 'provider::test',
            modelId: 'model::test',
            connectionData: {
                apiKey: 'test-key',
            },
        });
        expect(modelConnection).toBeDefined();
        expect(modelConnection.id).toBe('model-connection::test');
    });
});
