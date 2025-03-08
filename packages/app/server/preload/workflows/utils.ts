import { ChatContext, Intelegence, LanguageModel, OpenAIChatBasedLLM } from '@abyss/intelligence';
import { Chat, Message, ModelConnections } from '@prisma/client';

export function buildIntelegenceForChat(chat: Chat, aiConnection: ModelConnections) {
    let languageModel: LanguageModel | undefined;

    if (aiConnection.provider === 'OpenAI') {
        languageModel = new OpenAIChatBasedLLM({
            modelId: aiConnection.modelId,
            apiKey: (aiConnection.data as any)['apiKey'],
        });
    }

    if (!languageModel) {
        throw new Error('Unsupported AI provider');
    }

    return new Intelegence({
        language: languageModel,
    });
}

export function buildChatContext(messages: Message[]) {
    let context = ChatContext.fromStrings();

    for (const message of messages) {
        if (message.role === 'USER') {
            context = context.addUserMessage(message.content);
        }
        if (message.role === 'AI') {
            context = context.addBotMessage(message.content);
        }
        if (message.role === 'INTERNAL') {
            context = context.addUserMessage(message.content);
        }
    }

    return context;
}
