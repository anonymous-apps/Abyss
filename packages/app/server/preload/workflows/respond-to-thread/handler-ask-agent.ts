import { createZodFromObject, Operations } from '@abyss/intelligence';
import { MessageController } from '../../controllers/message';
import { MessageThreadController } from '../../controllers/message-thread';
import { MetricController } from '../../controllers/metric';
import { ModelInvokeController } from '../../controllers/model-invoke';
import { RenderedConversationThreadController } from '../../controllers/rendered-conversation-thread';
import { AiLabelChat } from '../label-chat';
import { buildIntelegence, buildThread } from '../utils';
import { AskAgentToRespondToThreadInput } from './types';

export async function handlerAskAgentToRespondToThread(input: AskAgentToRespondToThreadInput) {
    // Async start label
    void AiLabelChat(input);

    // Setup the model and thread
    const connection = await buildIntelegence(input.connection);
    const thread = await buildThread(input.messages);

    // Block the chat thread
    const modelInvoke = await ModelInvokeController.createFromModelConnection(input.connection);
    const renderedThread = await RenderedConversationThreadController.createFromThread(thread);
    await MessageThreadController.lockThread(input.thread.id, modelInvoke.id);

    try {
        // Stream the response via tool calls
        const toolDefinitions = input.toolConnections.map(tool => ({
            name: tool.tool.name,
            description: tool.tool.description,
            parameters: createZodFromObject(tool.tool.schema),
        }));

        const response = await Operations.generateWithTools({ model: connection, thread, toolDefinitions });
        await RenderedConversationThreadController.updateRawInput(renderedThread.id, response.threadInput.serialize());

        // Capture the metrics
        MetricController.consume(response.outputMetrics, {
            provider: connection.provider,
            model: connection.id,
            thread: input.thread.id,
        });

        // Rerender thread
        await RenderedConversationThreadController.update(renderedThread.id, {
            messages: response.threadOutput.serialize(),
        });

        // Save the messages to the chat thread
        const messages = response.outputMessages;
        console.log('messages', messages);
        for (const message of messages) {
            if (message.type === 'text') {
                await MessageController.create({
                    threadId: input.thread.id,
                    sourceId: input.agent.id,
                    references: {
                        modelInvokeId: modelInvoke.id,
                        renderedConversationThreadId: renderedThread.id,
                    },
                    content: {
                        text: message.content,
                    },
                });
            }

            if (message.type === 'toolCall') {
                await MessageController.create({
                    threadId: input.thread.id,
                    sourceId: input.agent.id,
                    content: {
                        tool: {
                            toolId: message.name,
                            name: message.name,
                            parameters: message.args,
                        },
                    },
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
            messages: response.threadOutput.serialize(),
        });
    } catch (error) {
        console.error('Error in handlerAskAgentToRespondToThread', error);
    } finally {
        await MessageThreadController.unlockThread(input.thread.id);
    }
}
