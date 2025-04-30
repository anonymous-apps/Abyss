import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { TextDocumentRecord } from './textDocument';
import { TextDocumentType } from './textDocument.type';

export class TextDocumentController extends RecordController<TextDocumentType, TextDocumentRecord> {
    constructor(connection: PrismaConnection) {
        super(
            'textDocument',
            'A document that can be written to and read from by both users and agents',
            connection,
            data => new TextDocumentRecord(this, data)
        );
    }
}
