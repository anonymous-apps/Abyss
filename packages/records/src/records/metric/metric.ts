import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import { SQliteClient } from '../../sqlite/sqlite-client';
import { MetricType } from './metric.type';

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
        const data = await this.client.execute(`SELECT * FROM metric WHERE name = ?`, [metricName]);
        const dataParsed = data as MetricType[];
        const results: MetricType[] = [];
        for (const row of dataParsed) {
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
        const data = await this.client.execute(`SELECT DISTINCT name FROM metric`);
        const dataParsed = data as { name: string }[];
        return dataParsed.map(row => row.name);
    }
}

export class ReferencedMetricRecord extends ReferencedSqliteRecord<MetricType> {
    constructor(id: string, client: SQliteClient) {
        super('metric', id, client);
    }
}
