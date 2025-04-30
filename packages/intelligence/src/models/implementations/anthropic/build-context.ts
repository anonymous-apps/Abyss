import { MessageThreadType } from '@abyss/records';
import { Log } from '../../../utils/logs';
import { AnthropicContent, AnthropicMessage } from './types';

export function buildAnthropicMessages(thread: MessageThreadType): AnthropicMessage[] {
    const turns = thread.turns;
    const messages: AnthropicMessage[] = [];

    for (const turn of turns) {
        const role = turn.senderId.toLowerCase() === 'human' ? 'user' : 'assistant';
        const content: AnthropicContent[] = [];

        for (const partial of turn.partials) {
            if (partial.type === 'text') {
                content.push({ type: 'text', text: partial.payload.content });
            } else {
                Log.warn('AnthropicSerializer', `Cant serialize partial: ${partial.type} as anthropic doesnt support it currently`);
            }
        }

        messages.push({ role, content });
    }

    return messages;
}
