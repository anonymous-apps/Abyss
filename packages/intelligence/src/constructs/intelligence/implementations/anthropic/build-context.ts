import { Log } from '../../../../utils/logs';
import { Thread } from '../../../thread';
import { AnthropicContent, AnthropicMessage } from './types';

export function buildAnthropicMessages(thread: Thread): AnthropicMessage[] {
    const turns = thread.getTurns();
    const messages: AnthropicMessage[] = [];

    for (const turn of turns) {
        const role = turn.sender === 'bot' ? 'assistant' : 'user';
        const content: AnthropicContent[] = [];

        for (const partial of turn.partials) {
            if (partial.type === 'text') {
                content.push({ type: 'text', text: partial.text.content });
            } else {
                Log.warn('AnthropicSerializer', `Cant serialize partial: ${partial.type} as anthropic doesnt support it currently`);
            }
        }

        messages.push({ role, content });
    }

    return messages;
}
