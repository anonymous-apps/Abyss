import { BaseRecordProps } from '../recordClass';

export interface RecordDocument extends BaseRecordProps {
    previousId: string | null;
    nextId: string | null;
    type: 'markdown';
    title: string;
    content: string;
}
