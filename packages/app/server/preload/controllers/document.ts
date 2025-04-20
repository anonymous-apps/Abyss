import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface DocumentRecord extends BaseRecord {
    previousId: string;
    nextId: string;
    text: string;
    type: string;
    title: string;
}

class _DocumentController extends BaseDatabaseConnection<DocumentRecord> {
    constructor() {
        super('document', 'Document with version, text, type, and title');
    }

    async createNextVersion(documentId: string, data: Omit<DocumentRecord, 'id' | 'createdAt' | 'updatedAt' | 'previousId' | 'nextId'>) {
        if (!documentId) {
            return this.create({
                ...data,
                previousId: '',
                nextId: '',
            });
        }

        const document = await this.findById(documentId);
        if (!document) {
            throw new Error('Document not found');
        }

        const nextDocument = await this.create({
            ...data,
            previousId: documentId,
            nextId: '',
        });
        await this.update(documentId, { nextId: nextDocument.id });
        return nextDocument;
    }
}

export const DocumentController = new _DocumentController();
