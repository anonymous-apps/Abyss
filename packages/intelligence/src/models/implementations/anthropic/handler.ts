import { Log } from '../../../utils/logs';
import { InvokeModelInternalResult } from '../../types';
import { buildAnthropicMessages } from './build-context';
import { AnthropicMessage, AnthropicResponse, InvokeAnthropicProps } from './types';

function anthropicMessageToRawString(message: AnthropicMessage[]): string {
    let result: string = '';
    for (const msg of message) {
        result += `--------\n${msg.role}\n\n`;
        for (const content of msg.content) {
            if (content.type === 'text') {
                result += content.text + '\n';
            }
        }
    }
    return result;
}

export async function InvokeAnthropic(props: InvokeAnthropicProps): Promise<Omit<InvokeModelInternalResult, 'logStream'>> {
    const messages = await buildAnthropicMessages(props.thread);
    const modelId = props.modelId;
    const apiKey = props.apiKey;

    await props.logStream.log('anthropic-handler', 'Invoking Anthropic API', {
        messages,
    });
    await props.logStream.log('anthropic-handler', 'Anthropic Raw prompt: \n\n' + anthropicMessageToRawString(messages));

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
            },
            body: JSON.stringify({
                model: modelId,
                messages,
                stream: false,
                max_tokens: 9000,
            }),
        });

        if (!response.ok) {
            throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        const parsed = JSON.parse(JSON.stringify(responseData)) as AnthropicResponse;

        await props.logStream.log('anthropic-handler', 'Anthropic API response', {
            response: parsed,
        });

        // Create metrics
        const metrics = {
            inputTokens: parsed.usage?.input_tokens || 0,
            outputTokens: parsed.usage?.output_tokens || 0,
            totalTokens: (parsed.usage?.input_tokens || 0) + (parsed.usage?.output_tokens || 0),
        };
        const responseText = parsed.content[0]?.text || '';

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
