import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { ModelConnection } from './modelConnection.type';

export class ModelConnectionController extends RecordController<ModelConnection> {
    constructor(connection: PrismaConnection) {
        super('modelConnection', connection, (data: any) => data as ModelConnection);
    }
}
