import { ReferencedMessageThreadRecord } from '@abyss/records';
import { buildConversationPrompt } from '../../prompts/buildConversationPrompt';
import { OpenAIMessage } from './types';

export async function buildOpenAIMessages(thread: ReferencedMessageThreadRecord): Promise<OpenAIMessage[]> {
    const conversationTurns = await buildConversationPrompt(thread, thread.client);
    const messages: OpenAIMessage[] = [];

    for (const turn of conversationTurns) {
        const isUser = turn.senderId === 'user';

        messages.push({
            role: isUser ? 'user' : 'assistant',
            content: turn.prompt.render(),
        });
    }

    return messages;
}
