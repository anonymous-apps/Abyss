import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { MetricRecord } from './metric';
import { MetricType } from './metric.type';

export class MetricController extends RecordController<'metric', MetricType, MetricRecord> {
    constructor(connection: PrismaConnection) {
        super(
            'metric',
            'a metric collected and stored locally for your own reference to understand the performance of the application',
            connection,
            data => new MetricRecord(this, data)
        );
    }

    public async getUniqueDimensionsForMetric(metricName: string): Promise<Record<string, string[]>> {
        const metrics = await this.table.findMany({
            where: {
                name: metricName,
            },
            select: {
                dimensions: true,
            },
        });

        const dimensionsMap: Record<string, string[]> = {};

        for (const metric of metrics) {
            const dimensions = metric.dimensions as Record<string, string>;

            for (const [key, value] of Object.entries(dimensions)) {
                if (!dimensionsMap[key]) {
                    dimensionsMap[key] = [];
                }

                if (!dimensionsMap[key].includes(value)) {
                    dimensionsMap[key].push(value);
                }
            }
        }

        return dimensionsMap;
    }

    public async uniqueNames(): Promise<string[]> {
        const metrics = await this.table.findMany({
            select: {
                name: true,
            },
            distinct: ['name'],
        });
        return metrics.map(metric => metric.name);
    }

    public async queryMetrics(name: string, dimensions: Record<string, string>): Promise<MetricType[]> {
        const metrics = await this.table.findMany({
            where: {
                name,
                dimensions: {
                    equals: dimensions,
                },
            },
        });
        return metrics as unknown as MetricType[];
    }
}
