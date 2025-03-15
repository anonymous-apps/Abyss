import { ChatContext, Intelegence, LanguageModel, OpenAIChatBasedLLM } from '@abyss/intelligence';
import { MessageRecord } from '../controllers/message';
import { ModelConnectionsRecord } from '../controllers/model-connections';

export function buildIntelegence(aiConnection: ModelConnectionsRecord) {
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

export function buildChatContext(messages: MessageRecord[]) {
    let context = ChatContext.fromStrings();

    for (const message of messages) {
        if (message.type === 'USER') {
            context = context.addUserMessage(message.content);
        }
        if (message.type === 'AI') {
            context = context.addBotMessage(message.content);
        }
        if (message.type === 'INTERNAL') {
            context = context.addUserMessage(message.content);
        }
    }

    return context;
}
