import { ReferencedMessageThreadRecord } from '@abyss/records';
import { buildConversationPrompt } from '../../prompts/buildConversationPrompt';
import { OpenAIMessage } from './types';

export async function buildOpenAIMessages(thread: ReferencedMessageThreadRecord): Promise<OpenAIMessage[]> {
    const conversationTurns = await buildConversationPrompt(thread, thread.client);

    const messages: OpenAIMessage[] = [];

    for (const turn of conversationTurns) {
        const isUser = turn.senderId === 'user' || turn.senderId === 'system';

        const lastMessage = messages[messages.length - 1];

        if (lastMessage && lastMessage.role === 'user' && isUser) {
            const message = turn.prompt.render();
            if (message) {
                lastMessage.content += '\n' + message;
            }
        } else if (lastMessage && lastMessage.role === 'assistant' && !isUser) {
            const message = turn.prompt.render();
            if (message) {
                lastMessage.content += '\n' + message;
            }
        } else if (isUser) {
            messages.push({
                role: 'user',
                content: turn.prompt.render() || 'continue',
            });
        } else {
            messages.push({
                role: 'assistant',
                content: turn.prompt.render() || 'understood',
            });
        }
    }

    if (messages.at(-1)?.role === 'assistant') {
        messages.push({
            role: 'user',
            content: 'continue',
        });
    }

    return messages;
}
