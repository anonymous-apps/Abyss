import type { SQliteClient } from '../../sqlite/sqlite-client';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';
import type { MetricType } from './metric.type'; // Assuming MetricType is the actual type of a metric record

export interface MetricDetails {
    name: string;
    value: number;
    dimensions?: Record<string, string>;
}

export async function setupEmptyMetricTable(): Promise<{ client: SQliteClient }> {
    const client = await buildCleanDB();
    return { client };
}

export async function setupMetricTableWithASingleMetric(): Promise<{ client: SQliteClient; metric: MetricType }> {
    const client = await buildCleanDB();
    const metricData: MetricDetails = {
        name: 'default.single.metric',
        value: 123,
        dimensions: { source: 'mock' },
    };
    const createdMetric = await client.tables.metric.create({
        name: metricData.name,
        value: metricData.value,
        dimensionData: metricData.dimensions ?? {},
    });
    return { client, metric: createdMetric };
}

export interface DiverseMetricsSet {
    requestsUserGet: MetricType;
    requestsPostsGet: MetricType;
    databaseErrors: MetricType;
    cpuUtilization: MetricType;
}

export async function setupMetricTableWithDiverseMetrics(): Promise<{ client: SQliteClient; metrics: DiverseMetricsSet }> {
    const client = await buildCleanDB();

    const metricsToCreate: Record<keyof DiverseMetricsSet, MetricDetails> = {
        requestsUserGet: { name: 'app.requests.total', value: 100, dimensions: { route: '/api/users', method: 'GET' } },
        requestsPostsGet: { name: 'app.requests.total', value: 50, dimensions: { route: '/api/posts', method: 'GET' } },
        databaseErrors: { name: 'app.errors', value: 5, dimensions: { type: 'database' } },
        cpuUtilization: { name: 'system.cpu.utilization', value: 75.5 },
    };

    const createdMetrics: Partial<DiverseMetricsSet> = {};

    for (const key in metricsToCreate) {
        const metricDetail = metricsToCreate[key as keyof DiverseMetricsSet];
        createdMetrics[key as keyof DiverseMetricsSet] = await client.tables.metric.create({
            name: metricDetail.name,
            value: metricDetail.value,
            dimensionData: metricDetail.dimensions ?? {},
        });
    }

    return { client, metrics: createdMetrics as DiverseMetricsSet };
}
