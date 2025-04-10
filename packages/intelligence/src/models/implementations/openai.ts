import { AsyncStream } from '../../constructs';
import { ChatThread } from '../../constructs/chat-thread/chat-thread';
import { Log } from '../../utils/logs';
import { createStreamingFetch } from '../../utils/network/fetch-utils';
import { createGenericStreamParser, parseJSON, parseSSE } from '../../utils/network/stream-parser';
import { LanguageModel } from '../language-model';

export interface OpenAILanguageModelOptions {
    apiKey?: string;
    modelId?: string;
    enableVision?: boolean;
}

interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: any[];
}

interface OpenAIStreamResponse {
    choices?: Array<{
        delta?: {
            content?: string;
        };
    }>;
}

export class OpenAILanguageModel extends LanguageModel {
    private modelId = 'gpt-4o';
    private apiKey: string;
    private enableVision: boolean;

    constructor(props: OpenAILanguageModelOptions = {}) {
        // If vision is enabled, use a model that supports it
        const defaultModelId = props.enableVision ? 'gpt-4o' : 'gpt-4o';

        super('openai', props.modelId || defaultModelId);
        this.apiKey = props.apiKey || (process && process.env.OPENAI_API_KEY) || '';
        this.modelId = props.modelId || defaultModelId;
        this.enableVision = props.enableVision || false;
    }

    private buildMessages(thread: ChatThread): OpenAIMessage[] {
        const turns = thread.getTurns();
        const messages: OpenAIMessage[] = [];

        // Convert the chat turns into OpenAI API format
        for (const turn of turns) {
            const role = turn.sender === 'user' ? 'user' : 'assistant';
            const content: any[] = [];

            for (const partial of turn.partials) {
                if (partial.type === 'text') {
                    content.push({ type: 'text', text: partial.content });
                } else if (partial.type === 'image' && this.enableVision) {
                    content.push({
                        type: 'image_url',
                        image_url: {
                            url: `data:image/jpeg;base64,${partial.base64Data}`,
                        },
                    });
                }
            }

            // If content only has text and it's the only item, simplify to string format
            if (content.length === 1 && content[0].type === 'text') {
                messages.push({ role, content: content[0].text });
            } else if (content.length > 0) {
                messages.push({ role, content });
            }
        }

        return messages;
    }

    protected async _stream(thread: ChatThread): Promise<AsyncStream<string>> {
        const messages = this.buildMessages(thread);
        const modelName = this.getName();

        try {
            // Create the fetch request
            const response = await createStreamingFetch(
                'https://api.openai.com/v1/chat/completions',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                    body: JSON.stringify({
                        model: this.modelId,
                        messages,
                        stream: true,
                    }),
                },
                modelName
            );

            if (!response.body) {
                throw new Error('Response body is null');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Create a parser function for OpenAI's streaming format
            const parseOpenAIChunk = (chunk: string): string | null => {
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    const sseData = parseSSE(line);
                    if (sseData) {
                        const parsed = parseJSON<OpenAIStreamResponse>(sseData);
                        if (parsed?.choices?.[0]?.delta?.content) {
                            return parsed.choices[0].delta.content;
                        }
                    }
                }

                return null;
            };

            // Use the generic stream parser
            return createGenericStreamParser(reader, decoder, modelName, parseOpenAIChunk);
        } catch (error) {
            Log.error(modelName, `Streaming error: ${error}`);
            throw error;
        }
    }
}
