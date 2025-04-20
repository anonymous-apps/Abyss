import { createZodFromObject, Operations } from '@abyss/intelligence';
import { ChatController, ChatRecord } from '../../controllers/chat';
import { MessageRecord } from '../../controllers/message';
import { MessageThreadRecord } from '../../controllers/message-thread';
import { MetricController } from '../../controllers/metric';
import { ModelConnectionsRecord } from '../../controllers/model-connections';
import { buildIntelegence, buildThread } from '../utils';
export interface AiLabelChatInput {
    chat: ChatRecord;
    thread: MessageThreadRecord;
    messages: MessageRecord[];
    connection: ModelConnectionsRecord;
}

export async function AiLabelChat(input: AiLabelChatInput) {
    // Setup the model and thread
    const connection = await buildIntelegence(input.connection);
    const thread = await buildThread(input.messages);

    // Tool definitions
    const toolDefinitions = [
        {
            name: 'label',
            description: 'Label the chat',
            parameters: createZodFromObject({
                summary: 'a summary of the chat, 1 sentence or less',
                labelText: 'the label to apply to the chat, 3 words or less',
            }),
        },
    ];
    const threadWithQuestion = thread.addUserTextMessage(`
        Can you use this label tool to give a short label to this chat so far.
        The label should be 3 words or less.
        The label should be a single phrase that captures the essence of the chat so far.
        The label shouldnt worry about tool calls or definitions, just the core user requests.
    `);

    // Stream the response
    const stream = await Operations.streamWithTools({ model: connection, thread: threadWithQuestion, toolDefinitions });

    // Capture the metrics
    stream.modelResponse.metrics.then(metrics => {
        Object.entries(metrics).forEach(([key, value]) => {
            MetricController.emit({
                name: key,
                dimensions: {
                    provider: connection.provider,
                    model: connection.id,
                    thread: input.thread.id,
                },
                value,
            });
        });
    });

    stream.onToolCallUpdate(async toolCall => {
        if (toolCall.name === 'label') {
            const label = toolCall.args.labelText;
            await ChatController.nameChat(input.chat.id, label);
        }
    });
}
