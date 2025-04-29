import { MessagePartial, MessageThreadRecord } from '@abyss/records';

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
    outputParsed: MessagePartial[];
    outputThread: MessageThreadRecord;
    metrics: Record<string, number>;
}
