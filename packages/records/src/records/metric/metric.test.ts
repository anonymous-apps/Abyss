import { describe, expect, test } from 'vitest';
import { setupEmptyMetricTable, setupMetricTableWithDiverseMetrics } from './metric.mocking';

describe('Metric Table Reference', () => {
    describe('when we create a new metric object', () => {
        test('we can use a key value map without dimensions and see they are all published', async () => {
            const { client } = await setupEmptyMetricTable();
            const values = { 'metric.a': 1, 'metric.b': 2 };
            await client.tables.metric.publishMetricObject(values);

            const metricsA = await client.tables.metric.queryMetrics('metric.a');
            expect(metricsA.length).toBe(1);
            expect(metricsA[0].value).toBe(1);
            expect(metricsA[0].dimensionData).toEqual({});

            const metricsB = await client.tables.metric.queryMetrics('metric.b');
            expect(metricsB.length).toBe(1);
            expect(metricsB[0].value).toBe(2);
            expect(metricsB[0].dimensionData).toEqual({});
        });

        test('we can use a key value map with dimensions and see the dimensions are associated with each metric', async () => {
            const { client } = await setupEmptyMetricTable();
            const values = { 'metric.c': 3, 'metric.d': 4 };
            const dimensions = { foo: 'bar', baz: 'qux' };
            await client.tables.metric.publishMetricObject(values, dimensions);

            const metricsC = await client.tables.metric.queryMetrics('metric.c');
            expect(metricsC.length).toBe(1);
            expect(metricsC[0].value).toBe(3);
            expect(metricsC[0].dimensionData).toEqual(dimensions);

            const metricsD = await client.tables.metric.queryMetrics('metric.d');
            expect(metricsD.length).toBe(1);
            expect(metricsD[0].value).toBe(4);
            expect(metricsD[0].dimensionData).toEqual(dimensions);
        });
    });

    describe('when wrap a function in a metric', () => {
        const metricName = 'test.operation';
        const customDimensions = { environment: 'test', version: '1.0' };

        test('we can see the metric object published when metric is successful', async () => {
            const { client } = await setupEmptyMetricTable();
            await client.tables.metric.wrapSqliteMetric(metricName, customDimensions, async () => {});
            const successMetrics = await client.tables.metric.queryMetrics(`${metricName}:success`, customDimensions);
            expect(successMetrics.length).toBe(1);
            expect(successMetrics[0].value).toBe(1);
            const failedMetrics = await client.tables.metric.queryMetrics(`${metricName}:failed`, customDimensions);
            expect(failedMetrics.length).toBe(1);
            expect(failedMetrics[0].value).toBe(0);
        });

        test('we can see the metric object published when metric is failed', async () => {
            const { client } = await setupEmptyMetricTable();
            await expect(
                client.tables.metric.wrapSqliteMetric(metricName, customDimensions, async () => {
                    throw new Error('Simulated failure');
                })
            ).rejects.toThrow('Simulated failure');
            const successMetrics = await client.tables.metric.queryMetrics(`${metricName}:success`, customDimensions);
            expect(successMetrics.length).toBe(1);
            expect(successMetrics[0].value).toBe(0);
            const failedMetrics = await client.tables.metric.queryMetrics(`${metricName}:failed`, customDimensions);
            expect(failedMetrics.length).toBe(1);
            expect(failedMetrics[0].value).toBe(1);
        });

        test('we see our own dimensions added to the metric object', async () => {
            const { client } = await setupEmptyMetricTable();
            await client.tables.metric.wrapSqliteMetric(metricName, customDimensions, async () => {});
            const successMetrics = await client.tables.metric.queryMetrics(`${metricName}:success`, customDimensions);
            expect(successMetrics[0].dimensionData).toEqual(customDimensions);
            const ranMetrics = await client.tables.metric.queryMetrics(`${metricName}:ran`, customDimensions);
            expect(ranMetrics[0].dimensionData).toEqual(customDimensions);
        });

        test('we see custom dimensions added to the metric object for duration and ran', async () => {
            const { client } = await setupEmptyMetricTable();
            await client.tables.metric.wrapSqliteMetric(metricName, customDimensions, async () => {});
            const durationMetrics = await client.tables.metric.queryMetrics(`${metricName}:duration`, customDimensions);
            expect(durationMetrics[0].value).toBeGreaterThanOrEqual(0);
            expect(durationMetrics[0].dimensionData).toEqual(customDimensions);
            const ranMetrics = await client.tables.metric.queryMetrics(`${metricName}:ran`, customDimensions);
            expect(ranMetrics[0].value).toBe(1);
            expect(ranMetrics[0].dimensionData).toEqual(customDimensions);
        });
    });

    describe('when we call getUniqueDimensionsForMetric', () => {
        test('we see no dimensions for an unknown metric name', async () => {
            const { client } = await setupMetricTableWithDiverseMetrics(); // Use diverse set to ensure other metrics don't interfere
            const dimensions = await client.tables.metric.getUniqueDimensionsForMetric('unknown.metric.nonexistent');
            expect(dimensions).toEqual({});
        });

        test('we see no dimensions for a metric with no dimensions', async () => {
            const { client, metrics } = await setupMetricTableWithDiverseMetrics();
            const dimensions = await client.tables.metric.getUniqueDimensionsForMetric(metrics.cpuUtilization.name); // cpuUtilization has no dimensions
            expect(dimensions).toEqual({});
        });

        test('we see the dimensions for a metric with dimensions', async () => {
            const { client, metrics } = await setupMetricTableWithDiverseMetrics();
            const dimensions = await client.tables.metric.getUniqueDimensionsForMetric(metrics.requestsUserGet.name); // app.requests.total

            expect(dimensions).toHaveProperty('route');
            expect(dimensions.route).toEqual(expect.arrayContaining(['/api/users', '/api/posts']));
            expect(dimensions.route.length).toBe(2);

            expect(dimensions).toHaveProperty('method');
            expect(dimensions.method).toEqual(expect.arrayContaining(['GET']));
            expect(dimensions.method.length).toBe(1);

            expect(Object.keys(dimensions).length).toBe(2);
        });
    });

    describe('when we call queryMetrics', () => {
        test('we get no results for an unknown metric name', async () => {
            const { client } = await setupMetricTableWithDiverseMetrics();
            const results = await client.tables.metric.queryMetrics('nonexistent.metric.name');
            expect(results).toEqual([]);
        });

        test('we get all values of a metric if we pass in no dimensions', async () => {
            const { client, metrics } = await setupMetricTableWithDiverseMetrics();
            const results = await client.tables.metric.queryMetrics(metrics.requestsUserGet.name); // app.requests.total
            expect(results.length).toBe(2);
            expect(results).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        name: metrics.requestsUserGet.name,
                        value: metrics.requestsUserGet.value,
                        dimensionData: metrics.requestsUserGet.dimensionData,
                    }),
                    expect.objectContaining({
                        name: metrics.requestsPostsGet.name,
                        value: metrics.requestsPostsGet.value,
                        dimensionData: metrics.requestsPostsGet.dimensionData,
                    }),
                ])
            );
        });

        test('we get all values of a metric that match one dimension if we pass in one dimension', async () => {
            const { client, metrics } = await setupMetricTableWithDiverseMetrics();
            const results = await client.tables.metric.queryMetrics(metrics.requestsUserGet.name, { route: '/api/users' });
            expect(results.length).toBe(1);
            expect(results[0]).toMatchObject(metrics.requestsUserGet);
        });

        test('we get all values of a metric that match all dimensions if we pass in many dimensions', async () => {
            const { client, metrics } = await setupMetricTableWithDiverseMetrics();
            const results = await client.tables.metric.queryMetrics(metrics.requestsPostsGet.name, { route: '/api/posts', method: 'GET' });
            expect(results.length).toBe(1);
            expect(results[0]).toMatchObject(metrics.requestsPostsGet);
        });
    });

    describe('when we call getUniqueNames', () => {
        test('we get no results if there are no metrics', async () => {
            const { client } = await setupEmptyMetricTable();
            const names = await client.tables.metric.getUniqueNames();
            expect(names).toEqual([]);
        });

        test('we get all unique names if we have metrics', async () => {
            const { client, metrics } = await setupMetricTableWithDiverseMetrics();
            const names = await client.tables.metric.getUniqueNames();

            expect(names).toEqual(
                expect.arrayContaining([
                    metrics.requestsUserGet.name, // app.requests.total
                    metrics.databaseErrors.name, // app.errors
                    metrics.cpuUtilization.name, // system.cpu.utilization
                ])
            );
            expect(names.length).toBe(3); // app.requests.total is one unique name
            expect(new Set(names).size).toBe(names.length); // Ensure returned names are unique
        });
    });
});
