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

    public async getUniqueDimensionsForMetric(metricName: string): Promise<string[]> {
        const metrics = await this.table.findMany({
            where: {
                name: metricName,
            },
            select: {
                dimensions: true,
            },
            distinct: ['dimensions'],
        });

        return metrics.map(metric => metric.dimensions).filter(dimension => dimension !== null && dimension !== undefined) as string[];
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

    public async queryMetrics(name: string, dimensions: Record<string, string>): Promise<MetricRecord[]> {
        const metrics = await this.table.findMany({
            where: {
                name,
                dimensions: {
                    equals: dimensions,
                },
            },
        });
        return metrics.map(metric => new MetricRecord(this, metric as unknown as MetricType));
    }
}
