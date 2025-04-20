import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface DocumentRecord extends BaseRecord {
    version: number;
    text: string;
    type: string;
    title: string;
}

class _DocumentController extends BaseDatabaseConnection<DocumentRecord> {
    constructor() {
        super('document', 'Document with version, text, type, and title');
    }
}

export const DocumentController = new _DocumentController();
