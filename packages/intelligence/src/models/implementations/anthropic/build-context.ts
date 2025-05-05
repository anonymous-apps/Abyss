import { ReferencedMessageThreadRecord } from '@abyss/records';
import { Log } from '../../../utils/logs';
import { AnthropicContent, AnthropicMessage } from './types';

export async function buildAnthropicMessages(thread: ReferencedMessageThreadRecord): Promise<AnthropicMessage[]> {
    const conversationTurns = await thread.getTurns();
    const messages: AnthropicMessage[] = [];

    for (const turn of conversationTurns) {
        const role = turn.senderId.toLowerCase() === 'user' ? 'user' : 'assistant';
        const content: AnthropicContent[] = [];

        for (const partial of turn.messages) {
            if (partial.type === 'text') {
                if (partial.payloadData.content) {
                    content.push({ type: 'text', text: partial.payloadData.content });
                }
            } else {
                Log.warn('AnthropicSerializer', `Cant serialize partial: ${partial.type} as anthropic doesnt support it currently`);
            }
        }

        messages.push({ role, content });
    }

    return messages;
}
