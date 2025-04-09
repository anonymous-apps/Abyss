import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface MetricRecord extends BaseRecord {
    name: string;
    dimensions?: Record<string, any>;
    value: number;
}

class _MetricController extends BaseDatabaseConnection<MetricRecord> {
    constructor() {
        super('metric', 'Metrics and data tracked over time');
    }

    async emit(props: { name: string; dimensions?: Record<string, any>; value: number }) {
        const record = await this.create({
            name: props.name,
            dimensions: props.dimensions,
            value: props.value,
        });
    }

    async readLatest(count: number = 10) {
        return (await this.getTable().findMany({
            orderBy: { createdAt: 'desc' },
            take: count,
        })) as MetricRecord[];
    }

    async queryMetrics(name: string, dimensions: Record<string, any> = {}) {
        const getMetricRecordsByName = await this.getTable().findMany({
            where: {
                name,
            },
        });

        const metricsByDimensions = getMetricRecordsByName.filter(record => {
            return Object.keys(record.dimensions || {}).every(key => {
                return record.dimensions[key] === dimensions[key];
            });
        });

        return metricsByDimensions;
    }

    async getUniqueMetricNames() {
        const metrics = await this.getTable().findMany();
        const uniqueNames = [...new Set(metrics.map(metric => metric.name))];
        return uniqueNames as string[];
    }
}

export const MetricController = new _MetricController();
