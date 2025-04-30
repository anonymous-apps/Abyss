import { ReferencedDatabaseRecord } from '../recordClass';
import { ModelConnectionController } from './modelConnection.controller';
import { ModelConnectionType } from './modelConnection.type';

export class ModelConnectionRecord extends ReferencedDatabaseRecord<ModelConnectionType> {
    constructor(controller: ModelConnectionController, id: string) {
        super(controller, id);
    }
}
