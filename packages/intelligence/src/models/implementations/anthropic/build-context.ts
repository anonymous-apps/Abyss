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
            messages.push({
                role: 'assistant',
                content: [{ type: 'text', text: 'understood' }],
            });
        }
        if (lastMessage && lastMessage.role === 'assistant' && !isUser) {
            messages.push({
                role: 'user',
                content: [{ type: 'text', text: 'continue' }],
            });
        }

        if (isUser) {
            messages.push({
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: turn.prompt.render() || 'continue',
                    },
                ],
            });
        } else {
            messages.push({
                role: 'assistant',
                content: [
                    {
                        type: 'text',
                        text: turn.prompt.render() || 'understood',
                    },
                ],
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
