import { ReferencedMessageThreadRecord, ReferencedModelConnectionRecord } from '@abyss/records';
import { InvokeAnthropic } from './implementations/anthropic/handler';
import { InvokeStatic } from './implementations/static/handler';

export async function invokeModelAgainstThread(connectionRef: ReferencedModelConnectionRecord, thread: ReferencedMessageThreadRecord) {
    const connection = await connectionRef.get();
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
