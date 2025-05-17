import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';

describe('Metric Table Reference', () => {
    test('can create and get a metric', async () => {
        const client = await buildCleanDB();
        const metricData = { name: 'test.metric', value: 123, dimensionData: { foo: 'bar' } };
        const createdMetric = await client.tables.metric.create(metricData);
        const fetchedMetric = await client.tables.metric.ref(createdMetric.id).get();
        expect(fetchedMetric.name).toEqual(metricData.name);
        expect(fetchedMetric.value).toEqual(metricData.value);
        expect(fetchedMetric.dimensionData).toEqual(metricData.dimensionData);
    });

    test('publishMetricObject creates metrics and queryMetrics retrieves them', async () => {
        const client = await buildCleanDB();
        const dimensions = { region: 'us-east-1', service: 'test-service' };
        const values = { 'metric.one': 10, 'metric.two': 20 };
        await client.tables.metric.publishMetricObject(values, dimensions);

        const metricsOne = await client.tables.metric.queryMetrics('metric.one', dimensions);
        expect(metricsOne.length).toBe(1);
        expect(metricsOne[0].value).toBe(10);
        expect(metricsOne[0].dimensionData).toEqual(dimensions);

        const metricsTwo = await client.tables.metric.queryMetrics('metric.two');
        expect(metricsTwo.length).toBe(1);
        expect(metricsTwo[0].value).toBe(20);
    });

    test('getUniqueNames and getUniqueDimensionsForMetric work correctly', async () => {
        const client = await buildCleanDB();
        await client.tables.metric.publishMetricObject({ 'name.a': 1 }, { dim: 'x', common: 'val' });
        await client.tables.metric.publishMetricObject({ 'name.b': 2 }, { dim: 'y', common: 'val' });
        await client.tables.metric.publishMetricObject({ 'name.a': 3 }, { dim: 'z', common: 'val2' });

        const uniqueNames = await client.tables.metric.getUniqueNames();
        expect(uniqueNames).toEqual(expect.arrayContaining(['name.a', 'name.b']));
        expect(uniqueNames.length).toBe(2);

        const uniqueDimsForNameA = await client.tables.metric.getUniqueDimensionsForMetric('name.a');
        expect(uniqueDimsForNameA.dim).toEqual(expect.arrayContaining(['x', 'z']));
        expect(uniqueDimsForNameA.common).toEqual(expect.arrayContaining(['val', 'val2']));
    });

    test('wrapSqliteMetric handles success and failure cases', async () => {
        const client = await buildCleanDB();
        const dims = { test: 'wrap' };

        await client.tables.metric.wrapSqliteMetric('my.op', dims, async () => {
            /* success */
        });
        let successMetrics = await client.tables.metric.queryMetrics('my.op:success', dims);
        expect(successMetrics[0]?.value).toBe(1);
        let failedMetrics = await client.tables.metric.queryMetrics('my.op:failed', dims);
        expect(failedMetrics[0]?.value).toBe(0);
        let durationMetrics = await client.tables.metric.queryMetrics('my.op:duration', dims);
        expect(durationMetrics[0]?.value).toBeGreaterThanOrEqual(0);
        let ranMetrics = await client.tables.metric.queryMetrics('my.op:ran', dims);
        expect(ranMetrics[0]?.value).toBe(1);

        await expect(
            client.tables.metric.wrapSqliteMetric('my.failing.op', dims, async () => {
                throw new Error('simulated failure');
            })
        ).rejects.toThrow('simulated failure');

        successMetrics = await client.tables.metric.queryMetrics('my.failing.op:success', dims);
        expect(successMetrics[0]?.value).toBe(0);
        failedMetrics = await client.tables.metric.queryMetrics('my.failing.op:failed', dims);
        expect(failedMetrics[0]?.value).toBe(1);
        durationMetrics = await client.tables.metric.queryMetrics('my.failing.op:duration', dims);
        expect(durationMetrics[0]?.value).toBeGreaterThanOrEqual(0);
        ranMetrics = await client.tables.metric.queryMetrics('my.failing.op:ran', dims);
        expect(ranMetrics[0]?.value).toBe(1);
    });
});
