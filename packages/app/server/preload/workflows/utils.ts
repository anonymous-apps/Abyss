import { ChatThread, GeminiLanguageModel, LanguageModel } from '@abyss/intelligence';
import { MessageRecord } from '../controllers/message';
import { ModelConnectionsRecord } from '../controllers/model-connections';

export function buildIntelegence(aiConnection: ModelConnectionsRecord) {
    let languageModel: LanguageModel | undefined;

    if (aiConnection.provider === 'Gemini') {
        languageModel = new GeminiLanguageModel({
            modelId: aiConnection.modelId,
            apiKey: (aiConnection.data as any)['apiKey'],
        });
    }

    if (!languageModel) {
        throw new Error('Unsupported AI provider');
    }

    return languageModel;
}

export function buildChatContext(messages: MessageRecord[]) {
    let context = ChatThread.fromStrings();

    for (const message of messages) {
        if (message.type === 'USER') {
            context = context.addUserTextMessage(message.content);
        }
        if (message.type === 'AI') {
            context = context.addBotTextMessage(message.content);
        }
        if (message.type === 'INTERNAL') {
            context = context.addUserTextMessage(message.content);
        }
    }

    return context;
}
