import { Thread } from '../../thread';
import { InvokeAnthropic } from '../implementations/anthropic';
import { Intelligence } from '../intelligence';
import { AIProviderAnthropic } from '../types';

export async function invokeProviderAgainstThread(provider: Intelligence, thread: Thread) {
    if (provider.id === 'anthropic') {
        return InvokeAnthropic({ thread, intelligence: provider as Intelligence<AIProviderAnthropic> });
    }
}
