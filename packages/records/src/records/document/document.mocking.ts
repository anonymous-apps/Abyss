import type { NewRecord } from '../../sqlite/sqlite.type';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';
import type { DocumentCellData, DocumentType } from './document.type';

export async function setupDocumentWithCells(cells: DocumentCellData[] = []) {
    const client = await buildCleanDB();
    const documentData: NewRecord<DocumentType> = {
        name: 'Test Document',
        type: 'text/markdown',
        documentContentData: cells,
    };
    const documentRecord = await client.tables.document.create(documentData);
    const documentRef = client.tables.document.ref(documentRecord.id);
    return { client, documentRef, documentRecord };
}

export async function setupEmptyDocument() {
    const client = await buildCleanDB();
    const documentData: NewRecord<DocumentType> = {
        name: 'Empty Document',
        type: 'text/markdown',
        documentContentData: [],
    };
    const documentRecord = await client.tables.document.create(documentData);
    const documentRef = client.tables.document.ref(documentRecord.id);
    return { client, documentRef, documentRecord };
}
