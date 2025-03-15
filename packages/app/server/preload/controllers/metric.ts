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
}

export const MetricController = new _MetricController();
