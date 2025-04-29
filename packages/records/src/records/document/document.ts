import { RecordClass } from '../recordClass';
import { RecordController } from '../recordController';
import { RecordDocument } from './document.type';

export class Document extends RecordClass<RecordDocument> {
    public previousId: string | null;
    public nextId: string | null;
    public type: 'markdown';
    public title: string;
    public content: string;

    constructor(controller: RecordController<Document>, data: RecordDocument) {
        super(controller, data);
        this.previousId = data.previousId;
        this.nextId = data.nextId;
        this.type = data.type;
        this.title = data.title;
        this.content = data.content;
    }
}
