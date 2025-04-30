import { ReferencedDatabaseRecord } from '../recordClass';
import { TextDocumentController } from './textDocument.controller';
import { TextDocumentType } from './textDocument.type';

export class TextDocumentRecord extends ReferencedDatabaseRecord<TextDocumentType> {
    constructor(controller: TextDocumentController, id: string) {
        super(controller, id);
    }
}
