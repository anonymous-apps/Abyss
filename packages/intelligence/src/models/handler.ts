import { MessageThreadRecord, ModelConnectionRecord } from '@abyss/records';
import { InvokeAnthropic } from './implementations/anthropic/handler';
import { InvokeStatic } from './implementations/static/handler';

export async function invokeModelAgainstThread(connection: ModelConnectionRecord, thread: MessageThreadRecord) {
    if (connection.accessFormat.toLowerCase() === 'anthropic') {
        return InvokeAnthropic({
            thread,
            modelId: connection.modelId,
            apiKey: connection.data.apiKey,
        });
    }
    if (connection.accessFormat.toLowerCase() === 'static') {
        return InvokeStatic({
            thread,
            response: connection.data.response,
        });
    }

    throw new Error(`Unknown AI access format: ${connection.accessFormat}`);
}
