import { Operations } from '@abyss/intelligence';
import { MessageController } from '../../controllers/message';
import { MessageThreadController } from '../../controllers/message-thread';
import { MetricController } from '../../controllers/metric';
import { ModelInvokeController } from '../../controllers/model-invoke';
import { RenderedConversationThreadController } from '../../controllers/rendered-conversation-thread';
import { buildIntelegence, buildThread } from '../utils';
import { AskRawModelToRespondToThreadInput } from './types';

export async function handlerAskRawModelToRespondToThread(input: AskRawModelToRespondToThreadInput) {
    // Setup the model and thread
    const connection = await buildIntelegence(input.connection);
    const thread = await buildThread(input.messages);

    // Block the chat thread
    const modelInvoke = await ModelInvokeController.createFromModelConnection(input.connection);
    const renderedThread = await RenderedConversationThreadController.createFromThread(thread);
    await MessageThreadController.lockThread(input.thread.id, modelInvoke.id);

    try {
        // Stream the response
        const response = await Operations.generateWithTools({ model: connection, thread, toolDefinitions: [] });
        await RenderedConversationThreadController.updateRawInput(renderedThread.id, response.threadInput);

        // Capture the metrics
        MetricController.consume(response.outputMetrics, {
            provider: connection.provider,
            model: connection.id,
            thread: input.thread.id,
        });

        // Save the messages to the chat thread
        const messages = response.outputMessages;
        for (const message of messages) {
            if (message.type === 'text') {
                await MessageController.create({
                    threadId: input.thread.id,
                    sourceId: input.connection.id,
                    references: {
                        modelInvokeId: modelInvoke.id,
                        renderedConversationThreadId: renderedThread.id,
                    },
                    content: {
                        text: message.content,
                    },
                });
            }
        }

        // Save the final rendered thread
        await ModelInvokeController.update(modelInvoke.id, {
            rawOutput: response.outputRaw,
            parsedMessages: response.apiBodyRaw,
        });

        // Save the final rendered thread
        await RenderedConversationThreadController.update(renderedThread.id, {
            messages: response.threadOutput.serialize(),
        });
    } catch (error) {
        console.error('Error in handlerAskRawModelToRespondToThread', error);
    } finally {
        await MessageThreadController.unlockThread(input.thread.id);
    }
}
