import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { MetricRecord } from './metric';
import { MetricType } from './metric.type';

export class MetricController extends RecordController<MetricType, MetricRecord> {
    constructor(connection: PrismaConnection) {
        super(
            'metric',
            'a metric collected and stored locally for your own reference to understand the performance of the application',
            connection,
            data => new MetricRecord(this, data)
        );
    }
}
