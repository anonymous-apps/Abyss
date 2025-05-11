import { Log } from '../../../utils/logs';
import { InvokeModelInternalResult } from '../../types';
import { buildOpenAIMessages } from './build-context';
import { InvokeOpenAIProps, OpenAIMessage, OpenAIResponse } from './types';

function openaiMessageToRawString(message: OpenAIMessage[]): string {
    let result: string = '';
    for (const msg of message) {
        result += '##### ROLE: ' + msg.role + '\n';
        result += msg.content + '\n';
    }
    return result;
}

export async function InvokeOpenAI(props: InvokeOpenAIProps): Promise<Omit<InvokeModelInternalResult, 'logStream'>> {
    const messages = await buildOpenAIMessages(props.thread);
    const modelId = props.modelId;
    const apiKey = props.apiKey;

    await props.logStream.log('openai-handler', 'Invoking OpenAI API', {
        messages,
    });
    await props.logStream.log('openai-handler', 'OpenAI Raw prompt: \n\n' + openaiMessageToRawString(messages));

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: modelId,
                messages,
            }),
        });

        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json();
        const parsed = JSON.parse(JSON.stringify(responseData)) as OpenAIResponse;

        await props.logStream.log('openai-handler', 'OpenAI API response', {
            response: parsed,
        });

        // Create metrics
        const metrics = {
            inputTokens: parsed.usage?.prompt_tokens || 0,
            outputTokens: parsed.usage?.completion_tokens || 0,
            totalTokens: parsed.usage?.total_tokens || 0,
        };
        const responseText = parsed.choices[0]?.message?.content || '';

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
