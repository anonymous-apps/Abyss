import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { Metric } from './metric';
import { MetricType } from './metric.type';

export class MetricController extends RecordController<MetricType, Metric> {
    constructor(connection: PrismaConnection) {
        super('metric', connection, data => new Metric(this, data));
    }
}
