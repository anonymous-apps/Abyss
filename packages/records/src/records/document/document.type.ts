import { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export interface DocumentType extends BaseSqliteRecord {
    type: string;
    name: string;
    lastVersionId?: string;
    nextVersionId?: string;
    documentContentData: DocumentCellData[];
}

interface DocumentCellBaseData {
    id: string;
    authorId: string;
    editedAt: number;
}

export interface DocumentCellHeaderData extends DocumentCellBaseData {
    type: 'header';
    content: string;
}

export interface DocumentCellHeader2Data extends DocumentCellBaseData {
    type: 'header2';
    content: string;
}

export interface DocumentCellTextData extends DocumentCellBaseData {
    type: 'text';
    content: string;
}

export type DocumentCellData = DocumentCellHeaderData | DocumentCellHeader2Data | DocumentCellTextData;
export type NewCellType = Omit<DocumentCellData, 'id' | 'editedAt'>;
