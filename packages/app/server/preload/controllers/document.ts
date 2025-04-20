import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface DocumentRecord extends BaseRecord {
    version: number;
    text: string;
}

class _DocumentController extends BaseDatabaseConnection<DocumentRecord> {
    constructor() {
        super('document', 'Document with version and text content');
    }
}

export const DocumentController = new _DocumentController();
