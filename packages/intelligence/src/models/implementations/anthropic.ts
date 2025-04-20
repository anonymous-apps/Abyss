import { AsyncObject } from '../../constructs/async-object/async-obj';
import { ChatThread } from '../../constructs/chat-thread/chat-thread';
import { Log } from '../../utils/logs';
import { createStreamingFetch } from '../../utils/network/fetch-utils';
import { createGenericStreamParser, parseJSON, parseSSE } from '../../utils/network/stream-parser';
import { createXmlFromObject } from '../../utils/object-to-xml/object-to-xml';
import { LanguageModel } from '../language-model';
import { LanguageModelStreamResult } from '../types';

export interface AnthropicLanguageModelOptions {
    apiKey?: string;
    modelId?: string;
    enableVision?: boolean;
}

interface AnthropicMessage {
    role: 'user' | 'assistant';
    content: string | AnthropicContent[];
}

interface AnthropicContent {
    type: 'text' | 'image';
    text?: string;
    source?: {
        type: 'base64';
        media_type: string;
        data: string;
    };
}

interface AnthropicStreamResponse {
    type: string;
    delta?: {
        text?: string;
    };
}

export class AnthropicLanguageModel extends LanguageModel {
    private modelId = 'claude-3-opus-20240229';
    private apiKey: string;
    private enableVision: boolean;

    constructor(props: AnthropicLanguageModelOptions = {}) {
        // If vision is enabled, use a model that supports it
        const defaultModelId = props.enableVision ? 'claude-3-opus-20240229' : 'claude-3-opus-20240229';

        super('anthropic', props.modelId || defaultModelId);
        this.apiKey = props.apiKey || (process && process.env.ANTHROPIC_API_KEY) || '';
        this.modelId = props.modelId || defaultModelId;
        this.enableVision = props.enableVision || false;
    }

    private buildMessages(thread: ChatThread): AnthropicMessage[] {
        const turns = thread.getTurns();
        const messages: AnthropicMessage[] = [];

        // Convert the chat turns into Anthropic API format
        for (const turn of turns) {
            const role = turn.sender === 'user' ? 'user' : 'assistant';
            const content: AnthropicContent[] = [];
            const differeedContent: AnthropicContent[] = [];

            for (const partial of turn.partials) {
                if (partial.type === 'text') {
                    content.push({ type: 'text', text: partial.content });
                } else if (partial.type === 'image' && this.enableVision) {
                    content.push({
                        type: 'image',
                        source: {
                            type: 'base64',
                            media_type: 'image/jpeg',
                            data: partial.base64Data,
                        },
                    });
                } else if (partial.type === 'toolCall') {
                    // Convert tool call to XML and add as text content
                    content.push({ type: 'text', text: createXmlFromObject(partial.name, partial.args) });
                    differeedContent.push({
                        type: 'text',
                        text: createXmlFromObject('toolCallResult', {
                            callId: partial.callId,
                            name: partial.name,
                            output: partial.output,
                        }),
                    });
                }
            }

            // If content only has text and it's the only item, simplify to string format
            if (content.length === 1 && content[0].type === 'text') {
                messages.push({ role, content: content[0].text || '' });
            } else if (content.length > 0) {
                messages.push({ role, content });
            }

            if (differeedContent.length > 0) {
                const otherRole = role === 'user' ? 'assistant' : 'user';
                messages.push({ role: otherRole, content: differeedContent });
            }
        }

        return messages;
    }

    protected async _stream(thread: ChatThread): Promise<LanguageModelStreamResult> {
        const messages = this.buildMessages(thread);
        const modelName = this.getName();
        const startTime = Date.now();

        try {
            // Create the fetch request
            const response = await createStreamingFetch(
                'https://api.anthropic.com/v1/messages',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': this.apiKey,
                        'anthropic-version': '2023-06-01',
                    },
                    body: JSON.stringify({
                        model: this.modelId,
                        messages,
                        max_tokens: 4096,
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

            // Create a parser function for Anthropic's streaming format
            const parseAnthropicChunk = (chunk: string): string | null => {
                const lines = chunk.split('\n').filter(line => line.trim() !== '');
                const results: string[] = [];
                for (const line of lines) {
                    const sseData = parseSSE(line);
                    if (sseData) {
                        const parsed = parseJSON<AnthropicStreamResponse>(sseData);
                        if (parsed && parsed.type === 'content_block_delta' && parsed.delta?.text) {
                            results.push(parsed.delta.text);
                        }
                    }
                }

                return results.join('');
            };

            // Use the generic stream parser
            const stream = await createGenericStreamParser(reader, decoder, modelName, parseAnthropicChunk);
            const resultMetrics = new AsyncObject<Record<string, number>>({});
            stream.waitForComplete().then(result => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                resultMetrics.update({
                    invokeTime: duration,
                    inputCharacters: messages.reduce((acc, message) => acc + message.content.length, 0),
                    outputCharacters: result.join('').length,
                    invokes: 1,
                });
                resultMetrics.dispatch();
            });

            // Return the stream and metadata
            return {
                metadata: {
                    inputContext: messages,
                },
                stream: stream,
                metrics: resultMetrics.subscribe(),
            };
        } catch (error) {
            Log.error(modelName, `Streaming error: ${error}`);
            throw error;
        }
    }
}
