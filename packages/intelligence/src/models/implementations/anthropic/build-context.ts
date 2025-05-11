import { ReferencedMessageThreadRecord } from '@abyss/records';
import { buildConversationPrompt } from '../../prompts/buildConversationPrompt';
import { AnthropicMessage } from './types';

export async function buildAnthropicMessages(thread: ReferencedMessageThreadRecord): Promise<AnthropicMessage[]> {
    const conversationTurns = await buildConversationPrompt(thread, thread.client);

    const messages: AnthropicMessage[] = [];

    for (const turn of conversationTurns) {
        const isUser = turn.senderId === 'user' || turn.senderId === 'system';

        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === 'user' && isUser) {
            lastMessage.content.push({ type: 'text', text: turn.prompt.render() || 'continue' });
        } else if (lastMessage && lastMessage.role === 'assistant' && !isUser) {
            lastMessage.content.push({ type: 'text', text: turn.prompt.render() || 'understood' });
        } else {
            messages.push({
                role: isUser ? 'user' : 'assistant',
                content: [{ type: 'text', text: turn.prompt.render() || 'continue' }],
            });
        }
    }

    if (messages.at(-1)?.role === 'assistant') {
        messages.push({
            role: 'user',
            content: [{ type: 'text', text: 'continue' }],
        });
    }

    return messages;
}
