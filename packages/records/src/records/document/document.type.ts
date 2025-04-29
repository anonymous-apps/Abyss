import { BaseRecordProps } from '../recordController';

export interface RecordDocument extends BaseRecordProps {
    previousId: string | null;
    nextId: string | null;
    type: 'markdown';
    title: string;
    text: string;
}
