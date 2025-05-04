import { BaseRecordProps } from '../recordClass';

export interface MetricType extends BaseRecordProps {
    name: string;
    dimensions: Record<string, string>;
    value: number;
}
