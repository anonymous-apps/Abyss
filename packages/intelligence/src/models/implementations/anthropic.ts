import { ChatThread } from '../../constructs/chat-thread/chat-thread';
import { Log } from '../../utils/logs';
import { createXmlFromObject } from '../../utils/object-to-xml/object-to-xml';
import { LanguageModel } from '../language-model';
import { LanguageModelChatResult } from '../types';

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

interface AnthropicResponse {
    content: Array<{
        text: string;
    }>;
    usage?: {
        input_tokens: number;
        output_tokens: number;
    };
}

export class AnthropicLanguageModel extends LanguageModel {
    private apiKey: string;
    private modelId: string;
    private enableVision: boolean;

    constructor(props: AnthropicLanguageModelOptions = {}) {
        super('anthropic', props.modelId || 'claude-3-opus-20240229');
        this.apiKey = props.apiKey || (process && process.env.ANTHROPIC_API_KEY) || '';
        this.modelId = props.modelId || 'claude-3-opus-20240229';
        this.enableVision = props.enableVision || false;
    }

    private buildMessages(thread: ChatThread): AnthropicMessage[] {
        const turns = thread.getTurns();
        const messages: AnthropicMessage[] = [];

        // Convert the chat turns into Anthropic API format
        for (const turn of turns) {
            const role = turn.sender === 'bot' ? 'assistant' : 'user';
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

    protected async _invoke(thread: ChatThread): Promise<LanguageModelChatResult> {
        const messages = this.buildMessages(thread);
        const modelName = this.getName();
        const startTime = Date.now();

        try {
            // Create the fetch request
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
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            const parsed = JSON.parse(JSON.stringify(responseData)) as AnthropicResponse;

            if (!parsed?.content?.[0]?.text) {
                throw new Error('No content in Anthropic response');
            }

            const responseText = parsed.content[0].text;

            // Create metrics
            const metrics = {
                inputTokens: parsed.usage?.input_tokens || 0,
                outputTokens: parsed.usage?.output_tokens || 0,
                totalTokens: (parsed.usage?.input_tokens || 0) + (parsed.usage?.output_tokens || 0),
            };

            // Return the result
            return {
                inputContext: messages,
                response: responseText,
                metrics: metrics,
            };
        } catch (error) {
            Log.error(modelName, `Error: ${error}`);
            throw error;
        }
    }
}
