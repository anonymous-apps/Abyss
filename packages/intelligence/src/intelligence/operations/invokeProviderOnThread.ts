import { Thread } from '../../thread/thread';
import { InvokeAnthropic } from '../implementations/anthropic/handler';
import { InvokeStatic } from '../implementations/static/handler';
import { Intelligence } from '../intelligence';
import { AIProviderAnthropic, AIProviderStatic } from '../types';

export async function invokeProviderAgainstThread(provider: Intelligence, thread: Thread) {
    if (provider.props.type === 'anthropic') {
        return InvokeAnthropic({ thread, intelligence: provider as Intelligence<AIProviderAnthropic> });
    }
    if (provider.props.type === 'static') {
        return InvokeStatic({ thread, intelligence: provider as Intelligence<AIProviderStatic> });
    }

    throw new Error(`Unknown provider: ${provider.id}`);
}
