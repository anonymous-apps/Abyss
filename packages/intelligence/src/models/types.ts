import { AsyncStream, ChatThread } from '../constructs';

export interface LanguageModelStreamResult {
    metadata: {
        inputContext: any[];
    };
    stream: AsyncStream<string>;
    metrics: Promise<Record<string, number>>;
}

export interface LanguageModelChatResult {
    metadata: {
        inputContext: any[];
    };
    response: string;
    outputThread: ChatThread;
}
