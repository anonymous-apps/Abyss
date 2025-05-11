import { ReferencedLogStreamRecord, ReferencedMessageThreadRecord } from '@abyss/records';

export interface InvokeOpenAIProps {
    thread: ReferencedMessageThreadRecord;
    logStream: ReferencedLogStreamRecord;
    modelId: string;
    apiKey: string;
}

export interface OpenAIResponse {
    choices: Array<{
        message: {
            role: string;
            content: string;
        };
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
