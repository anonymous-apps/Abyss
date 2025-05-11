import { ReferencedMessageThreadRecord, ReferencedModelConnectionRecord } from '@abyss/records';
import { parseLLMOutput } from '../parser/parser';
import { InvokeAnthropic } from './implementations/anthropic/handler';
import { InvokeOpenAI } from './implementations/openai/handler';
import { InvokeStatic } from './implementations/static/handler';

export async function invokeModelAgainstThread(connectionRef: ReferencedModelConnectionRecord, thread: ReferencedMessageThreadRecord) {
    const modelResponse = await invokeLLM(connectionRef, thread);
    const parsedData = await parseLLMOutput(modelResponse.outputString);

    return { ...modelResponse, parsed: parsedData };
}

async function invokeLLM(connectionRef: ReferencedModelConnectionRecord, thread: ReferencedMessageThreadRecord) {
    const connection = await connectionRef.get();
    if (connection.accessFormat.toLowerCase() === 'anthropic') {
        return InvokeAnthropic({
            thread,
            modelId: connection.modelId,
            apiKey: connection.connectionData.apiKey,
        });
    } else if (connection.accessFormat.toLowerCase() === 'openai') {
        return InvokeOpenAI({
            thread,
            modelId: connection.modelId,
            apiKey: connection.connectionData.apiKey,
        });
    } else if (connection.accessFormat.toLowerCase() === 'static') {
        return InvokeStatic({
            thread,
            response: connection.connectionData.response,
        });
    }

    throw new Error(`Unknown AI access format: ${connection.accessFormat}`);
}
