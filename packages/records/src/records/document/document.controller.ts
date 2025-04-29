import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { RecordDocument } from './document.type';

export class DocumentController extends RecordController<RecordDocument> {
    public constructor(connection: PrismaConnection) {
        super('document', connection);
    }
}
