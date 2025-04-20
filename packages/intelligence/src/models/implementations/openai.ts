import { ChatThread } from '../../constructs/chat-thread/chat-thread';
import { Log } from '../../utils/logs';
import { createXmlFromObject } from '../../utils/object-to-xml/object-to-xml';
import { LanguageModel } from '../language-model';
import { LanguageModelChatResult } from '../types';

export interface OpenAILanguageModelOptions {
    apiKey?: string;
    modelId?: string;
    enableVision?: boolean;
}

interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: any[];
}

interface OpenAIResponse {
    choices?: Array<{
        message?: {
            content?: string;
        };
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
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
            const role = turn.sender === 'bot' ? 'assistant' : 'user';
            const content: any[] = [];
            const differedMessages: any[] = [];

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
                } else if (partial.type === 'toolCall') {
                    // Convert tool call to XML and add as text content
                    content.push({ type: 'text', text: createXmlFromObject(partial.name, partial.args) });
                    differedMessages.push({
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
                messages.push({ role, content: content[0].text });
            } else if (content.length > 0) {
                messages.push({ role, content });
            }

            if (differedMessages.length > 0) {
                const otherRole = role === 'user' ? 'assistant' : 'user';
                messages.push({ role: otherRole, content: differedMessages });
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
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.modelId,
                    messages,
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            const parsed = JSON.parse(JSON.stringify(responseData)) as OpenAIResponse;

            if (!parsed?.choices?.[0]?.message?.content) {
                throw new Error('No content in OpenAI response');
            }

            const responseText = parsed.choices[0].message.content;

            const endTime = Date.now();
            const duration = endTime - startTime;

            // Create metrics
            const metrics = {
                invokeTime: duration,
                inputTokens: parsed.usage?.prompt_tokens || 0,
                outputTokens: parsed.usage?.completion_tokens || 0,
                totalTokens: parsed.usage?.total_tokens || 0,
                invokes: 1,
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
