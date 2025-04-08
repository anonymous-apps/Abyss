import { ChatThread, GeminiLanguageModel, LanguageModel, OpenAILanguageModel } from '@abyss/intelligence';
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

    if (aiConnection.provider === 'OpenAI') {
        languageModel = new OpenAILanguageModel({
            modelId: aiConnection.modelId,
            apiKey: (aiConnection.data as any)['apiKey'],
        });
    }

    if (!languageModel) {
        throw new Error('Unsupported AI provider');
    }

    return languageModel;
}

export function buildThread(messages: MessageRecord[]) {
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
        if (message.type === 'TOOL_RESULT') {
            const data = JSON.parse(message.content);
            context = context.addUserToolResultMessage(data.callId, data.result);
        }
        if (message.type === 'TOOL') {
            const data = JSON.parse(message.content);
            context = context.addBotToolCallMessage(data.callId, data.name, data.arguments);
        }
    }

    return context;
}
