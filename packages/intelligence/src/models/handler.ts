import { ModelConnectionType, ReferencedMessageThreadRecord } from '@abyss/records';
import { InvokeAnthropic } from './implementations/anthropic/handler';
import { InvokeStatic } from './implementations/static/handler';

export async function invokeModelAgainstThread(connection: ModelConnectionType, thread: ReferencedMessageThreadRecord) {
    if (connection.accessFormat.toLowerCase() === 'anthropic') {
        return InvokeAnthropic({
            thread,
            modelId: connection.modelId,
            apiKey: connection.connectionData.apiKey,
        });
    }
    if (connection.accessFormat.toLowerCase() === 'static') {
        return InvokeStatic({
            thread,
            response: connection.connectionData.response,
        });
    }

    throw new Error(`Unknown AI access format: ${connection.accessFormat}`);
}
