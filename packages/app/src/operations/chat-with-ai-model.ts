import { Operations } from '@abyss/intelligence';
import { Database } from '../main';

export function chatWithAiModel(humanMessage: string, modelConnectionId: string, chatId: string) {
    return Operations.invokeModelDirectlyHandler({
        modelConnectionId,
        humanMessage,
        chatId,
        database: Database,
    });
}
