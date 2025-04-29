import { RecordClass } from '../recordClass';
import { TextDocumentController } from './textDocument.controller';
import { TextDocumentType } from './textDocument.type';

export class TextDocumentRecord extends RecordClass<TextDocumentType> {
    public title: string;
    public type: 'markdown';
    public content: string;
    public previousId: string | null;
    public nextId: string | null;

    constructor(controller: TextDocumentController, data: TextDocumentType) {
        super(controller, data);
        this.title = data.title;
        this.type = data.type;
        this.content = data.content;
        this.previousId = data.previousId;
        this.nextId = data.nextId;
    }
}
