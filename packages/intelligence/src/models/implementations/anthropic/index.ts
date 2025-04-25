import { ChatThread } from '../../../constructs/chat-thread/chat-thread';
import { Log } from '../../../utils/logs';
import { LanguageModel } from '../../language-model';
import { LanguageModelChatResult } from '../../types';
import { buildAnthropicMessages } from './build-context';

export interface AnthropicLanguageModelOptions {
    apiKey?: string;
    modelId?: string;
    enableVision?: boolean;
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

    protected async _invoke(thread: ChatThread): Promise<LanguageModelChatResult> {
        const messages = buildAnthropicMessages(thread, this.enableVision);
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
