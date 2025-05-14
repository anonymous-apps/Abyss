import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import { SQliteClient } from '../../sqlite/sqlite-client';
import { randomId } from '../../utils/ids';
import { serializeDocument } from './document.serialize';
import { DocumentType, NewCellType } from './document.type';

export class ReferencedDocumentTable extends ReferencedSqliteTable<DocumentType> {
    constructor(client: SQliteClient) {
        super('document', 'A document', client);
    }

    public ref(id: string) {
        return new ReferencedDocumentRecord(id, this.client);
    }

    public async new(name: string, type: string) {
        return await this.create({
            name,
            type,
            documentContentData: [],
        });
    }

    public async nextVersion(previousId: string) {
        const previous = await this.client.tables.document.ref(previousId).get();
        const next = await this.create({
            name: previous.name,
            type: previous.type,
            lastVersionId: previous.id,
            documentContentData: previous.documentContentData,
        });
        return next;
    }
}

export class ReferencedDocumentRecord extends ReferencedSqliteRecord<DocumentType> {
    constructor(id: string, client: SQliteClient) {
        super('document', id, client);
    }

    public async getLast() {
        const data = await this.get();
        if (!data.lastVersionId) return null;
        return new ReferencedDocumentRecord(data.lastVersionId, this.client);
    }

    public async getNext() {
        const data = await this.get();
        if (!data.nextVersionId) return null;
        return new ReferencedDocumentRecord(data.nextVersionId, this.client);
    }

    public async replaceCell(id: string, newData: NewCellType) {
        const data = await this.get();
        const updatedContent = data.documentContentData.map(cell =>
            cell.id === id ? { ...cell, ...newData, editedAt: Date.now() } : cell
        );
        await this.update({ documentContentData: updatedContent });
    }

    public async addCellAtStart(newCellData: NewCellType) {
        const data = await this.get();
        const updatedContent = [...data.documentContentData];
        updatedContent.unshift({ ...newCellData, editedAt: Date.now(), id: randomId() });
        await this.update({ documentContentData: updatedContent });
    }

    public async addCellAtEnd(newCellData: NewCellType) {
        const data = await this.get();
        const updatedContent = [...data.documentContentData];
        updatedContent.push({ ...newCellData, editedAt: Date.now(), id: randomId() });
        await this.update({ documentContentData: updatedContent });
    }

    public async addCellAfter(cellId: string, newCellData: NewCellType) {
        const data = await this.get();
        const index = data.documentContentData.findIndex(cell => cell.id === cellId);
        if (index === -1) return;

        const updatedContent = [...data.documentContentData];
        updatedContent.splice(index + 1, 0, { ...newCellData, editedAt: Date.now(), id: randomId() });
        await this.update({ documentContentData: updatedContent });
    }

    public async addCellBefore(cellId: string, newCellData: NewCellType) {
        const data = await this.get();
        const index = data.documentContentData.findIndex(cell => cell.id === cellId);
        if (index === -1) return;

        const updatedContent = [...data.documentContentData];
        updatedContent.splice(index, 0, { ...newCellData, editedAt: Date.now(), id: randomId() });
        await this.update({ documentContentData: updatedContent });
    }

    public async deleteCell(cellId: string) {
        const data = await this.get();
        const updatedContent = data.documentContentData.filter(cell => cell.id !== cellId);
        await this.update({ documentContentData: updatedContent });
    }

    public async toRenderedString() {
        const data = await this.get();
        return serializeDocument(data);
    }

    public async saveVersion() {
        const currentData = await this.get();
        const nextVersion = await this.client.tables.document.create({
            name: currentData.name,
            type: currentData.type,
            lastVersionId: currentData.id,
            documentContentData: currentData.documentContentData,
        });

        await this.update({ nextVersionId: nextVersion.id });
        return new ReferencedDocumentRecord(nextVersion.id, this.client);
    }
}
