import { createZodFromObject, Operations } from '@abyss/intelligence';
import { MessageController, MessageRecord, MessageToolCall } from '../../controllers/message';
import { MessageThreadController } from '../../controllers/message-thread';
import { RenderedConversationThreadController } from '../../controllers/rendered-conversation-thread';
import { ResponseStreamController } from '../../controllers/response-stream';
import { buildIntelegence, buildThread } from '../utils';
import { AskAgentToRespondToThreadInput } from './types';

export async function handlerAskAgentToRespondToThread(input: AskAgentToRespondToThreadInput) {
    // Setup the model and thread
    const connection = await buildIntelegence(input.connection);
    const thread = buildThread(input.messages);

    // Block the chat thread
    const responseStream = await ResponseStreamController.createFromModelConnection(input.connection);
    const renderedThread = await RenderedConversationThreadController.createFromThread(thread);
    await MessageThreadController.lockThread(input.thread.id, responseStream.id);

    try {
        for (const tool of input.toolConnections) {
            console.log(tool.tool.schema);
        }
        // Stream the response via tool calls
        const toolDefinitions = input.toolConnections.map(tool => ({
            name: tool.tool.name,
            description: tool.tool.description,
            parameters: createZodFromObject(tool.tool.schema),
        }));

        const stream = await Operations.streamWithTools({ model: connection, thread, toolDefinitions });

        // Rerender thread
        await RenderedConversationThreadController.update(renderedThread.id, {
            messages: stream.inputThread.serialize(),
        });

        // Save the messages to the chat thread as they are produced
        const seenMessages: Record<string, MessageRecord> = {};
        const firstMessageReferences = {
            responseStreamId: responseStream.id,
            renderedConversationThreadId: renderedThread.id,
        };

        stream.onTextMessageUpdate(async message => {
            if (!seenMessages[message.uuid]) {
                const references = Object.keys(seenMessages).length === 0 ? firstMessageReferences : {};
                seenMessages[message.uuid] = await MessageController.create({
                    threadId: input.thread.id,
                    sourceId: input.agent.id,
                    status: 'streaming',
                    references,
                    content: {
                        text: message.content,
                    },
                });
            } else {
                await MessageController.update(seenMessages[message.uuid].id, {
                    content: {
                        text: message.content,
                    },
                });
            }
        });

        stream.onToolCallUpdate(async toolCall => {
            const toolConnection = input.toolConnections.find(
                tool => tool.tool.name.toLowerCase().replaceAll(' ', '-') === toolCall.name.toLowerCase().replaceAll(' ', '-')
            );

            if (!seenMessages[toolCall.uuid]) {
                const references = Object.keys(seenMessages).length === 0 ? firstMessageReferences : {};
                seenMessages[toolCall.uuid] = await MessageController.create({
                    threadId: input.thread.id,
                    sourceId: input.agent.id,
                    status: 'streaming',
                    references: {
                        ...references,
                        toolSourceId: toolConnection?.tool.id,
                    },
                    content: {
                        tool: {
                            toolId: toolConnection?.tool.id,
                            name: toolCall.name || '',
                            parameters: toolCall.arguments || {},
                            status: 'idle',
                        },
                    },
                });
            } else {
                const existing = seenMessages[toolCall.uuid];
                const existingContent = existing.content as MessageToolCall;
                await MessageController.update(existing.id, {
                    content: {
                        tool: {
                            ...existingContent.tool,
                            name: existingContent.tool.name || toolCall.name,
                            parameters: {
                                ...existingContent.tool.parameters,
                                ...toolCall.arguments,
                            },
                        },
                    },
                });
            }
        });

        // Wait for the stream to complete
        await stream.waitForCompletion();
        await ResponseStreamController.update(responseStream.id, {
            status: 'complete',
            rawOutput: stream.getRawOutput(),
            parsedMessages: stream.getMessages(),
        });

        // Save the final rendered thread
        const newThread = stream.inputThread.addBotTextMessage(stream.getRawOutput());
        await RenderedConversationThreadController.update(renderedThread.id, {
            messages: newThread.serialize(),
        });

        // Complete the messages once the stream is done
        await MessageController.completeMessagesById(Object.keys(seenMessages));
    } finally {
        await ResponseStreamController.complete(responseStream.id);
        await MessageThreadController.unlockThread(input.thread.id);
    }
}
