import { ReferencedMessageRecord } from '@abyss/records';
import { invokeModelAgainstThread } from '../../models/handler';
import { InvokeModelDirectlyParams } from './types';

export async function invokeModelDirectlyHandler(options: InvokeModelDirectlyParams) {
    const { database, modelConnectionId, chatId, humanMessage } = options;
    const chatRef = database.tables.chatThread.ref(chatId);

    try {
        // Add the human message to the chat
        const messageRecord = await chatRef.client.tables.message.create({
            senderId: 'user',
            type: 'text',
            payloadData: {
                content: humanMessage,
            },
        });
        await chatRef.addMessages(new ReferencedMessageRecord(messageRecord.id, chatRef.client));
        await chatRef.block(modelConnectionId);

        // Load the data
        const modelConnectionRef = database.tables.modelConnection.ref(modelConnectionId);
        const model = await modelConnectionRef.get();
        const chatData = await chatRef.get();
        const threadData = database.tables.messageThread.ref(chatData.threadId);

        // Invoke the model
        const response = await invokeModelAgainstThread(modelConnectionRef, threadData);

        // Add metrics
        database.tables.metric.publishMetricObject(response.metrics, {
            modelId: model.modelId,
            provider: model.providerId,
        });

        // Update the chat with the response
        const messageRecord2 = await chatRef.client.tables.message.create({
            senderId: modelConnectionRef.id,
            type: 'text',
            payloadData: {
                content: response.outputString,
            },
        });
        await chatRef.addMessages(new ReferencedMessageRecord(messageRecord2.id, chatRef.client));
    } catch (error) {
        console.error(error);
    } finally {
        await chatRef.unblock();
    }
}
