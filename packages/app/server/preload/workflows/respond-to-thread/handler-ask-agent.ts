import { Operations } from '@abyss/intelligence';
import { MessageController } from '../../controllers/message';
import { MessageThreadController } from '../../controllers/message-thread';
import { MetricController } from '../../controllers/metric';
import { ModelInvokeController } from '../../controllers/model-invoke';
import { RenderedConversationThreadController } from '../../controllers/rendered-conversation-thread';
import { buildIntelegence, buildThread } from '../utils';
import { AskAgentToRespondToThreadInput } from './types';

export async function handlerAskAgentToRespondToThread(input: AskAgentToRespondToThreadInput) {
    // Setup the model and thread
    const connection = await buildIntelegence(input.connection);
    const thread = await buildThread(input.messages);

    // Block the chat thread
    const modelInvoke = await ModelInvokeController.createFromModelConnection(input.connection);
    const renderedThread = await RenderedConversationThreadController.createFromThread(thread);
    await MessageThreadController.lockThread(input.thread.id, modelInvoke.id);

    try {
        // Build the tool definitions
        const toolDefinitions = input.toolConnections.map(tool => ({
            id: tool.tool.shortId,
            name: tool.tool.name,
            description: tool.tool.description,
            parameters: tool.tool.schema,
        }));

        // Compute delta messages and add them to the thread
        const deltaMessages = thread.setCurrentTools(toolDefinitions);
        if (deltaMessages.messages.length > 0) {
            await MessageController.addManyToThread(input.thread.id, 'SYSTEM', deltaMessages.messages);
        }

        // Generate the response
        const response = await Operations.generateWithTools({ model: connection, thread: deltaMessages.newThread });
        await RenderedConversationThreadController.updateRawInput(renderedThread.id, response.threadInput.save());

        // Capture the metrics
        MetricController.consume(response.outputMetrics, {
            provider: connection.provider,
            model: connection.id,
            thread: input.thread.id,
        });

        // Rerender thread
        await RenderedConversationThreadController.update(renderedThread.id, {
            messages: response.threadOutput.save(),
        });

        // Save the messages to the chat thread
        const messages = response.outputMessages;
        for (const message of messages) {
            if (message.type === 'text') {
                await MessageController.create({
                    threadId: input.thread.id,
                    sourceId: input.agent.id,
                    references: {
                        modelInvokeId: modelInvoke.id,
                        renderedConversationThreadId: renderedThread.id,
                    },
                    content: message,
                });
            }

            if (message.type === 'toolRequest') {
                await MessageController.create({
                    threadId: input.thread.id,
                    sourceId: input.agent.id,
                    content: message,
                });
            }
        }

        // Save the model invoke
        await ModelInvokeController.update(modelInvoke.id, {
            rawOutput: response.outputRaw,
            parsedMessages: response.apiBodyRaw,
        });

        // Save the final rendered thread
        await RenderedConversationThreadController.update(renderedThread.id, {
            messages: response.threadOutput.save(),
        });
    } catch (error) {
        console.error('Error in handlerAskAgentToRespondToThread', error);
    } finally {
        await MessageThreadController.unlockThread(input.thread.id);
    }
}
