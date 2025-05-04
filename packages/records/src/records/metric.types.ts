import { BaseSqliteRecord } from '../sqlite/sqlite.type';

export interface MetricType extends BaseSqliteRecord {
    name: string;
    dimensions: Record<string, string>;
    value: number;
}
