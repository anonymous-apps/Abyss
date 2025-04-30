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

export async function chatWithAgentGraph(humanMessage: string, agentGraphId: string, chatId: string) {
    return Operations.handlerOnHumanMessage({
        graphId: agentGraphId,
        humanMessage,
        chatId,
        database: Database,
    });
}
