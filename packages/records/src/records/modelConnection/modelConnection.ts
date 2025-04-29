import { RecordClass } from '../recordClass';
import { ModelConnectionController } from './modelConnection.controller';
import { ModelConnection, ModelConnectionAccessFormat } from './modelConnection.type';

export class ModelConnectionRecord extends RecordClass<ModelConnection> {
    public name: string;
    public description: string;
    public accessFormat: ModelConnectionAccessFormat;
    public providerId: string;
    public modelId: string;
    public data: any;

    constructor(controller: ModelConnectionController, data: ModelConnection) {
        super(controller, data);
        this.name = data.name;
        this.description = data.description;
        this.accessFormat = data.accessFormat;
        this.providerId = data.providerId;
        this.modelId = data.modelId;
        this.data = data.data;
    }
}
