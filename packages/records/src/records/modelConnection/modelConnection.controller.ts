import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { ModelConnectionRecord } from './modelConnection';
import { ModelConnectionType } from './modelConnection.type';

export class ModelConnectionController extends RecordController<ModelConnectionType, ModelConnectionRecord> {
    constructor(connection: PrismaConnection) {
        super('modelConnection', connection, (data: any) => new ModelConnectionRecord(this, data));
    }
}
