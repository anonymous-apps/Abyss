import { BaseRecordProps } from '../recordClass';

export interface ChatThreadType extends BaseRecordProps {
    name: string;
    description: string;
    threadId: string;
    participantId: string;
    blocker?: string | null;
}
