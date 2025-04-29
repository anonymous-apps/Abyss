import { Log } from '../../../utils/logs';
import { InvokeModelInternalResult } from '../../types';
import { buildAnthropicMessages } from './build-context';
import { AnthropicResponse, InvokeAnthropicProps } from './types';

export async function InvokeAnthropic(props: InvokeAnthropicProps): Promise<InvokeModelInternalResult> {
    const messages = buildAnthropicMessages(props.thread);
    const modelId = props.modelId;
    const apiKey = props.apiKey;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: modelId,
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
            inputRaw: messages,
            outputRaw: responseText,
            outputString: responseText,
            metrics: metrics,
        };
    } catch (error) {
        Log.error(modelId, `Error: ${error}`);
        throw error;
    }
}
