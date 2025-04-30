import { RecordClass } from '../recordClass';
import { MetricController } from './metric.controller';
import { MetricType } from './metric.type';

export class MetricRecord extends RecordClass<MetricType> {
    public name: string;
    public dimensions: Record<string, string>;
    public value: number;

    constructor(controller: MetricController, data: MetricType) {
        super(controller, data);
        this.name = data.name;
        this.dimensions = data.dimensions;
        this.value = data.value;
    }
}
