import { AsyncStream } from '../../constructs';
import { ChatThread } from '../../constructs/chat-thread/chat-thread';
import { StreamedChatResponse } from '../../constructs/streamed-chat-response/chat-response';
import { Log } from '../../utils/logs';
import { LanguageModel } from '../language-model';

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
                }
            }

            // If content only has text and it's the only item, simplify to string format
            if (content.length === 1 && content[0].type === 'text') {
                messages.push({ role, content: content[0].text || '' });
            } else if (content.length > 0) {
                messages.push({ role, content });
            }
        }

        return messages;
    }

    protected override async _invoke(thread: ChatThread): Promise<ChatThread> {
        const messages = this.buildMessages(thread);

        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01',
                },
                body: JSON.stringify({
                    model: this.modelId,
                    messages,
                    max_tokens: 4096,
                }),
                mode: 'no-cors',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    `Anthropic API error: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`
                );
            }

            const data = await response.json();

            // Handle response
            if (!data.content || data.content.length === 0) {
                throw new Error('No response generated from Anthropic API');
            }

            const responseContent = data.content[0].text;
            return thread.addBotTextMessage(responseContent);
        } catch (error) {
            console.error('Unexpected error:', error);
            throw error;
        }
    }

    protected override async _stream(thread: ChatThread): Promise<AsyncStream<string>> {
        const messages = this.buildMessages(thread);
        const stream = new AsyncStream<string>();

        (async () => {
            try {
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
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
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(
                        `Anthropic API error: ${response.status} ${response.statusText}${
                            errorData ? ` - ${JSON.stringify(errorData)}` : ''
                        }`
                    );
                }

                if (!response.body) {
                    throw new Error('Response body is null');
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        // Skip empty lines
                        if (!line.trim()) continue;

                        // Anthropic uses Server-Sent Events format
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);

                            // Check for the [DONE] message
                            if (data === '[DONE]') {
                                continue;
                            }

                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.type === 'content_block_delta' && parsed.delta && parsed.delta.text) {
                                    stream.push(parsed.delta.text);
                                }
                            } catch (error) {
                                Log.warn(this.getName(), `Failed to parse chunk: ${error}`);
                            }
                        }
                    }
                }

                stream.close();
            } catch (error) {
                Log.error(this.getName(), `Unexpected error: ${error}`);
                stream.setError(error as Error);
            }
        })();

        return stream;
    }

    async streamWithTools({ thread, toolDefinitions }: { thread: ChatThread; toolDefinitions: any[] }): Promise<StreamedChatResponse> {
        const messages = this.buildMessages(thread);
        const response = new StreamedChatResponse({ model: this, inputThread: thread });

        (async () => {
            try {
                const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
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
                        tools: toolDefinitions.length > 0 ? toolDefinitions : undefined,
                    }),
                    mode: 'no-cors',
                });

                if (!apiResponse.ok) {
                    const errorData = await apiResponse.json().catch(() => null);
                    throw new Error(
                        `Anthropic API error: ${apiResponse.status} ${apiResponse.statusText}${
                            errorData ? ` - ${JSON.stringify(errorData)}` : ''
                        }`
                    );
                }

                if (!apiResponse.body) {
                    throw new Error('Response body is null');
                }

                const reader = apiResponse.body.getReader();
                const decoder = new TextDecoder();
                let currentToolCall: { id: string; name: string; arguments: string } | null = null;

                response.startNewTextMessage();

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) {
                        break;
                    }

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.trim() !== '');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);

                            if (data === '[DONE]') {
                                continue;
                            }

                            try {
                                const parsed = JSON.parse(data);

                                // Handle text content
                                if (parsed.type === 'content_block_delta' && parsed.delta && parsed.delta.text) {
                                    response.addTextToCurrentTextMessage(parsed.delta.text);
                                }

                                // Handle tool calls - Anthropic's format may differ from OpenAI
                                // This is a placeholder implementation that would need to be adjusted
                                // based on the actual Anthropic tool calling format
                                if (parsed.type === 'tool_call_delta') {
                                    // Implementation would depend on Anthropic's specific format
                                    // This is just a placeholder
                                }
                            } catch (error) {
                                Log.warn(this.getName(), `Failed to parse chunk: ${error}`);
                            }
                        }
                    }
                }

                response.complete();
            } catch (error) {
                Log.error(this.getName(), `Unexpected error: ${error}`);
                throw error;
            }
        })();

        return response;
    }
}
