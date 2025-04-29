import { BaseRecordProps } from '../recordClass';

export interface TextDocumentType extends BaseRecordProps {
    title: string;
    type: 'markdown';
    content: string;
    previousId: string | null;
    nextId: string | null;
}
