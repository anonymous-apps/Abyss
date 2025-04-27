import { Thread } from '../../thread/thread';
import { InvokeAnthropic } from '../implementations/anthropic/handler';
import { Intelligence } from '../intelligence';
import { AIProviderAnthropic } from '../types';

export async function invokeProviderAgainstThread(provider: Intelligence, thread: Thread) {
    if (provider.id === 'anthropic') {
        return InvokeAnthropic({ thread, intelligence: provider as Intelligence<AIProviderAnthropic> });
    }
}
