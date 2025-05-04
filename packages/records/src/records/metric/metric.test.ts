import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.test';

describe('Metric::create', () => {
    test('Happy: Create metric record', async () => {
        const client = await buildCleanDB();
        const metric = await client.tables.metric.create({
            id: 'metric::test',
            name: 'Test Metric',
            dimensionData: {
                environment: 'test',
                service: 'test-service',
            },
            value: 42,
        });
        expect(metric).toBeDefined();
        expect(metric.id).toBe('metric::test');
    });
});
