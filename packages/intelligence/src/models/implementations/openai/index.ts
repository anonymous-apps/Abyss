import { ChatThread } from '../../../constructs/chat-thread/chat-thread';
import { Log } from '../../../utils/logs';
import { LanguageModel } from '../../language-model';
import { LanguageModelChatResult } from '../../types';
import { buildOpenAIMessages } from './build-context';

export interface OpenAILanguageModelOptions {
    apiKey?: string;
    modelId?: string;
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

    constructor(props: OpenAILanguageModelOptions = {}) {
        super('openai', props.modelId || 'gpt-4o');
        this.apiKey = props.apiKey || (process && process.env.OPENAI_API_KEY) || '';
        this.modelId = props.modelId || 'gpt-4o';
    }

    protected async _invoke(thread: ChatThread): Promise<LanguageModelChatResult> {
        const messages = buildOpenAIMessages(thread);
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
