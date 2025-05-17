import { ReferencedMessageRecord, type SQliteClient } from '@abyss/records';
import { invokeGraphHandler } from './handler';

export interface HandlerOnHumanMessageParams {
    graphId: string;
    humanMessage: string;
    chatId: string;
    database: SQliteClient;
}

export async function handlerOnHumanMessage(options: HandlerOnHumanMessageParams) {
    const { graphId, humanMessage, chatId, database } = options;
    const chatRef = database.tables.chatThread.ref(chatId);

    try {
        // Block chat and add human message
        await chatRef.block(graphId);
        const messageRecord = await chatRef.client.tables.message.create({
            senderId: 'user',
            type: 'text',
            payloadData: {
                content: humanMessage,
            },
        });
        await chatRef.addMessages(new ReferencedMessageRecord(messageRecord.id, chatRef.client));
        // Send event to graph for it to process
        return await invokeGraphHandler({
            graphId,
            input: {
                type: 'onUserChat',
                chatId,
                message: humanMessage,
            },
            database,
        });
    } catch (error) {
        console.error(error);
    } finally {
        await chatRef.unblock();
    }
}
