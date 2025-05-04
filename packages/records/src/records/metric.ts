import { ReferencedSqliteRecord } from '../sqlite/reference-record';
import { ReferencedSqliteTable } from '../sqlite/reference-table';
import { SQliteClient } from '../sqlite/sqlite-client';
import { MetricType } from './metric.types';

export class ReferencedMetricTable extends ReferencedSqliteTable<MetricType> {
    constructor(client: SQliteClient) {
        super('metric', 'A metric with dimensions and a numeric value', client);
    }
}

export class ReferencedMetricRecord extends ReferencedSqliteRecord<MetricType> {}
