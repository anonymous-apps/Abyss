import { MessageType, ReferencedMessageThreadRecord } from '@abyss/records';

export interface InvokeModelInternalResult {
    inputRaw: any;
    outputRaw: any;
    outputString: string;
    metrics: Record<string, number>;
}

export interface InvokeModelChatResult {
    inputRaw: any;
    outputRaw: any;
    outputString: string;
    outputParsed: MessageType[];
    outputThread: ReferencedMessageThreadRecord;
    metrics: Record<string, number>;
}
