import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { ModelConnectionRecord } from './modelConnection';
import { ModelConnection } from './modelConnection.type';

export class ModelConnectionController extends RecordController<ModelConnection> {
    constructor(connection: PrismaConnection) {
        super('modelConnection', connection, (data: any) => new ModelConnectionRecord(this, data));
    }
}
