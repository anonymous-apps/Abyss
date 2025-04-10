import { Operations } from '@abyss/intelligence';
import { MessageController, MessageRecord } from '../../controllers/message';
import { MessageThreadController } from '../../controllers/message-thread';
import { ResponseStreamController } from '../../controllers/response-stream';
import { buildIntelegence, buildThread } from '../utils';
import { AskRawModelToRespondToThreadInput } from './types';

export async function handlerAskRawModelToRespondToThread(input: AskRawModelToRespondToThreadInput) {
    // Setup the model and thread
    const connection = await buildIntelegence(input.connection);
    const thread = buildThread(input.messages);

    // Block the chat thread
    const responseStream = await ResponseStreamController.create({
        sourceId: input.connection.id,
        parsedMessages: [],
        status: 'streaming',
        rawOutput: '',
    });
    await MessageThreadController.lockThread(input.thread.id, responseStream.id);

    try {
        // Stream the response
        const stream = await Operations.streamText({
            model: connection,
            thread,
        });

        // Save the messages to the chat thread
        const seenTextMessages: Record<string, MessageRecord> = {};
        stream.onTextMessageUpdate(async message => {
            if (!seenTextMessages[message.uuid]) {
                seenTextMessages[message.uuid] = await MessageController.create({
                    threadId: input.thread.id,
                    sourceId: input.connection.id,
                    status: 'streaming',
                    references: {
                        responseStreamId: responseStream.id,
                    },
                    content: {
                        text: message.content,
                    },
                });
            }
            await MessageController.update(seenTextMessages[message.uuid].id, {
                content: {
                    text: message.content,
                },
            });
        });

        // Wait for the stream to complete
        await stream.waitForCompletion();

        // Complete the messages once the stream is done
        await MessageController.completeMessagesById(Object.keys(seenTextMessages));
    } finally {
        await MessageThreadController.unlockThread(input.thread.id);
    }
}
