import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { TextDocument } from './textDocument';
import { TextDocument as TextDocumentType } from './textDocument.type';

export class TextDocumentController extends RecordController<TextDocumentType> {
    constructor(connection: PrismaConnection) {
        super('textDocument', connection, data => new TextDocument(this, data));
    }
}
