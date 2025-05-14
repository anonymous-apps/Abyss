import { MessageType, ReferencedLogStreamRecord, ReferencedMessageThreadRecord } from '@abyss/records';
import { ReferencedChatSnapshotRecord } from '@abyss/records/dist/records/chat-snapshot/chat-snapshot';

export interface InvokeModelInternalResult {
    inputRaw: any;
    outputRaw: any;
    outputString: string;
    metrics: Record<string, number>;
    logStream: ReferencedLogStreamRecord;
    snapshot?: ReferencedChatSnapshotRecord;
}

export interface InvokeModelChatResult {
    inputRaw: any;
    outputRaw: any;
    outputString: string;
    outputParsed: MessageType[];
    outputThread: ReferencedMessageThreadRecord;
    metrics: Record<string, number>;
    snapshot?: ReferencedChatSnapshotRecord;
}
