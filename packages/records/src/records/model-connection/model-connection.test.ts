import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';
import type { NewModelConnectionArgs } from './model-connection';

describe('Model Connection Table Reference', () => {
    describe('when we create a new model connection', () => {
        test('we should be able to get a reference to it through table.ref(id)', async () => {
            const client = await buildCleanDB();

            const newConnectionArgs: NewModelConnectionArgs = {
                name: 'Test Connection',
                description: 'A test model connection',
                accessFormat: 'static',
                providerId: 'test-provider',
                modelId: 'test-model',
                connectionData: { apiKey: 'test-api-key' }, // Example connectionData
            };

            const modelConnection = await client.tables.modelConnection.newModelConnection(newConnectionArgs);

            const ref = client.tables.modelConnection.ref(modelConnection.id);
            const result = await ref.get();

            expect(result).toBeDefined();
            expect(result?.id).toEqual(modelConnection.id);
            expect(result?.name).toEqual(newConnectionArgs.name);
        });
    });
});
