import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import type { MetricType } from './metric.type';

export class ReferencedMetricTable extends ReferencedSqliteTable<MetricType> {
    constructor(client: SQliteClient) {
        super('metric', 'A metric with dimensions and a numeric value', client);
    }

    public ref(id: string) {
        return new ReferencedMetricRecord(id, this.client);
    }

    async getUniqueDimensionsForMetric(metricName: string) {
        const allData = await this.queryMetrics(metricName);
        const allDimensions: Record<string, Set<string>> = {};
        for (const row of allData) {
            for (const dimension of Object.keys(row.dimensionData)) {
                if (!allDimensions[dimension]) {
                    allDimensions[dimension] = new Set();
                }
                allDimensions[dimension].add(row.dimensionData[dimension]);
            }
        }
        const results: Record<string, string[]> = {};
        for (const dimension of Object.keys(allDimensions)) {
            results[dimension] = Array.from(allDimensions[dimension]);
        }
        return results;
    }

    async queryMetrics(metricName: string, dimensions: Record<string, string> = {}) {
        const data = await this.client.execute('SELECT * FROM metric WHERE name = ?', [metricName]);
        const decodedData: MetricType[] = (data as Record<string, unknown>[]).map(row =>
            ReferencedSqliteTable.deserialize(row as Record<string, unknown>)
        );
        const results: MetricType[] = [];
        for (const row of decodedData) {
            let matches = true;
            for (const dimension of Object.keys(dimensions)) {
                if (dimensions[dimension] && dimensions[dimension] !== row.dimensionData[dimension]) {
                    matches = false;
                    break;
                }
            }
            if (matches) {
                results.push(row);
            }
        }
        return results;
    }

    async getUniqueNames() {
        const data = await this.client.execute('SELECT DISTINCT name FROM metric');
        const dataParsed = data as { name: string }[];
        return dataParsed.map(row => row.name);
    }

    async publishMetricObject(values: Record<string, number>, dimensions: Record<string, string>) {
        for (const key of Object.keys(values)) {
            const value = values[key];
            await this.create({
                name: key,
                value,
                dimensionData: dimensions,
            });
        }
    }

    async wrapSqliteMetric<T>(metric: string, dimensions: Record<string, string>, handler: () => Promise<T> | T): Promise<T> {
        const startTime = Date.now();
        try {
            const result = await handler();
            this.publishMetricObject(
                {
                    [`${metric}:success`]: 1,
                    [`${metric}:failed`]: 0,
                },
                dimensions
            );
            return result;
        } catch (error) {
            this.publishMetricObject(
                {
                    [`${metric}:success`]: 0,
                    [`${metric}:failed`]: 1,
                },
                dimensions
            );
            throw error;
        } finally {
            this.publishMetricObject(
                {
                    [`${metric}:duration`]: Date.now() - startTime,
                    [`${metric}:ran`]: 1,
                },
                dimensions
            );
        }
    }
}

export class ReferencedMetricRecord extends ReferencedSqliteRecord<MetricType> {
    constructor(id: string, client: SQliteClient) {
        super('metric', id, client);
    }
}
