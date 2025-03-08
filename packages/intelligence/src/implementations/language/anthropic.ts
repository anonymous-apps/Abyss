import { LanguageModel, LanguageModelInvokeProps, LanguageModelProps, LanguageModelResponse } from '../../interfaces/language';
import axios from 'axios';

export interface AnthropicLLMOptions extends LanguageModelProps {
    apiKey?: string;
    modelId?: string;
}

export class AnthropicLLM extends LanguageModel {
    private modelId = 'claude-3-opus-20240229';
    private apiKey: string;

    constructor(props: AnthropicLLMOptions = {}) {
        super(props);
        this.apiKey = props.apiKey || (process && process.env.ANTHROPIC_API_KEY!);
        this.modelId = props.modelId || this.modelId;
    }

    public override getName(): string {
        return 'anthropic-' + this.modelId;
    }

    protected override async handleInvoke(props: LanguageModelInvokeProps): Promise<LanguageModelResponse> {
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: this.modelId,
                messages: props.chat.getMessages().map(message => ({
                    role: message.from === 'user' ? 'user' : 'assistant',
                    content: message.text,
                })),
                max_tokens: 3000,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey,
                    'anthropic-version': '2023-06-01',
                },
            }
        );

        return {
            response: response.data.content[0].text,
        };
    }
}
