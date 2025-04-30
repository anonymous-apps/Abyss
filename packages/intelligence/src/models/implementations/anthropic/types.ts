import { MessageThreadType } from '@abyss/records';

export interface InvokeAnthropicProps {
    thread: MessageThreadType;
    modelId: string;
    apiKey: string;
}

export interface AnthropicResponse {
    content: Array<{
        text: string;
    }>;
    usage?: {
        input_tokens: number;
        output_tokens: number;
    };
}

export interface AnthropicMessage {
    role: 'user' | 'assistant';
    content: AnthropicContent[];
}

export type AnthropicContent = AnthropicTextContent;

export interface AnthropicTextContent {
    type: 'text';
    text?: string;
}
