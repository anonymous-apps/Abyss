import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { Document } from './document';

export class DocumentController extends RecordController<Document> {
    public constructor(connection: PrismaConnection) {
        super('document', connection, data => new Document(this, data));
    }
}
