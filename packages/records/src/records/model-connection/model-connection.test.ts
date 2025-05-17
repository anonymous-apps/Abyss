import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';
import type { ModelConnectionType } from './model-connection.type';

describe('Model Connection Table Reference', () => {
    test('when we create a new model connection, we should be able to get a reference to it through table.ref(id)', async () => {
        const client = await buildCleanDB();
        const modelConnectionData: Omit<ModelConnectionType, 'id' | 'createdAt' | 'updatedAt'> = {
            name: 'Test Model Connection',
            description: 'A test model connection for Anthropic Claude 3 Opus',
            accessFormat: 'anthropic',
            providerId: 'anthropic', // Or a more specific ID if applicable
            modelId: 'claude-3-opus-20240229',
            connectionData: { apiKey: 'test-api-key', temperature: 0.5 }, // Example, adjust as needed
        };

        const newModelConnection = await client.tables.modelConnection.create(modelConnectionData);
        expect(newModelConnection).toBeDefined();
        expect(newModelConnection.id).toBeDefined();
        expect(newModelConnection.name).toEqual(modelConnectionData.name);
        expect(newModelConnection.description).toEqual(modelConnectionData.description);

        const ref = client.tables.modelConnection.ref(newModelConnection.id);
        const fetchedModelConnection = await ref.get();

        expect(fetchedModelConnection).toBeDefined();
        expect(fetchedModelConnection.id).toEqual(newModelConnection.id);
        expect(fetchedModelConnection.name).toEqual(modelConnectionData.name);
        expect(fetchedModelConnection.description).toEqual(modelConnectionData.description);
        expect(fetchedModelConnection.accessFormat).toEqual(modelConnectionData.accessFormat);
        expect(fetchedModelConnection.providerId).toEqual(modelConnectionData.providerId);
        expect(fetchedModelConnection.modelId).toEqual(modelConnectionData.modelId);
        expect(fetchedModelConnection.connectionData).toEqual(modelConnectionData.connectionData);
    });
});
