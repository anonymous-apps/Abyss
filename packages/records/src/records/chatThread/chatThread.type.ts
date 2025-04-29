import { BaseRecordProps } from '../recordClass';

export interface ChatThread extends BaseRecordProps {
    name: string;
    description: string;
    threadId: string;
    participantId: string;
}
