import { ReferencedDatabaseRecord } from '../recordClass';
import { MetricController } from './metric.controller';
import { MetricType } from './metric.type';

export class MetricRecord extends ReferencedDatabaseRecord<MetricType> {
    constructor(controller: MetricController, id: string) {
        super(controller, id);
    }
}
