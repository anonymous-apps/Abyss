import { Thread } from '../../../thread/thread';
import { Intelligence } from '../../intelligence';
import { AIProviderAnthropic } from '../../types';

export interface AnthropicResponse {
    content: Array<{
        text: string;
    }>;
    usage?: {
        input_tokens: number;
        output_tokens: number;
    };
}

export interface AnthropicLanguageModelOptions {
    thread: Thread;
    intelligence: Intelligence<AIProviderAnthropic>;
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
