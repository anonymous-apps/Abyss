import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { TextDocumentRecord } from './textDocument';
import { TextDocument as TextDocumentType } from './textDocument.type';

export class TextDocumentController extends RecordController<TextDocumentType> {
    constructor(connection: PrismaConnection) {
        super('textDocument', connection, data => new TextDocumentRecord(this, data));
    }
}
