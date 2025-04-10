import { AsyncStream } from '../../constructs';
import { ChatThread } from '../../constructs/chat-thread/chat-thread';
import { StreamedChatResponse } from '../../constructs/streamed-chat-response/chat-response';
import { Log } from '../../utils/logs';
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

    protected override async _invoke(thread: ChatThread): Promise<ChatThread> {
        const messages = this.buildMessages(thread);

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.modelId,
                    messages,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(
                    `OpenAI API error: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`
                );
            }

            const data = await response.json();

            // Handle response
            if (!data.choices || data.choices.length === 0) {
                throw new Error('No response generated from OpenAI API');
            }

            const responseContent = data.choices[0].message.content;
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
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                    body: JSON.stringify({
                        model: this.modelId,
                        messages,
                        stream: true,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(
                        `OpenAI API error: ${response.status} ${response.statusText}${errorData ? ` - ${JSON.stringify(errorData)}` : ''}`
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
                        // Skip the "data: " prefix and empty lines
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);

                            // Check for the [DONE] message
                            if (data === '[DONE]') {
                                continue;
                            }

                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.choices && parsed.choices.length > 0) {
                                    const delta = parsed.choices[0].delta;
                                    if (delta && delta.content) {
                                        stream.push(delta.content);
                                    }
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
                const apiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                    body: JSON.stringify({
                        model: this.modelId,
                        messages,
                        stream: true,
                        tools: toolDefinitions.length > 0 ? toolDefinitions : undefined,
                    }),
                });

                if (!apiResponse.ok) {
                    const errorData = await apiResponse.json().catch(() => null);
                    throw new Error(
                        `OpenAI API error: ${apiResponse.status} ${apiResponse.statusText}${
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
                                if (parsed.choices && parsed.choices.length > 0) {
                                    const delta = parsed.choices[0].delta;

                                    // Handle text content
                                    if (delta.content) {
                                        response.addTextToCurrentTextMessage(delta.content);
                                    }

                                    // Handle tool calls
                                    if (delta.tool_calls) {
                                        for (const toolCall of delta.tool_calls) {
                                            if (toolCall.index === 0 && !currentToolCall) {
                                                currentToolCall = {
                                                    id: toolCall.id || '',
                                                    name: toolCall.function?.name || '',
                                                    arguments: toolCall.function?.arguments || '',
                                                };
                                                response.startNewToolCall(currentToolCall.name);
                                            } else if (currentToolCall) {
                                                if (toolCall.function?.arguments) {
                                                    currentToolCall.arguments += toolCall.function.arguments;
                                                    try {
                                                        const args = JSON.parse(currentToolCall.arguments);
                                                        response.setToolCallArguments(args);
                                                    } catch (e) {
                                                        // Arguments not complete yet, continue accumulating
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } catch (error) {
                                Log.warn(this.getName(), `Failed to parse chunk: ${error}`);
                            }
                        }
                    }
                }

                Log.log(this.getName(), 'Completing stream');
                response.complete();
            } catch (error) {
                Log.error(this.getName(), `Unexpected error: ${error}`);
                throw error;
            }
        })();

        return response;
    }
}
