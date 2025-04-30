import { PrismaConnection } from '@abyss/records';
import { invokeGraphHandler } from './handler';

export interface HandlerOnHumanMessageParams {
    graphId: string;
    humanMessage: string;
    chatId: string;
    database: PrismaConnection;
}

export async function handlerOnHumanMessage(options: HandlerOnHumanMessageParams) {
    const { graphId, humanMessage, chatId, database } = options;
    const chatRef = database.table.chatThread.ref(chatId);

    try {
        // Block chat and add human message
        await chatRef.block(graphId);
        await chatRef.addHumanPartial({
            type: 'text',
            payload: {
                content: humanMessage,
            },
        });
        // Send event to graph for it to process
        return await invokeGraphHandler({
            graphId,
            input: {
                type: 'onUserChat',
                chatId,
            },
            database,
        });
    } catch (error) {
        console.error(error);
    } finally {
        await chatRef.unblock();
    }
}
