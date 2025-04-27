import { ChatController } from '../../controllers/chat';
import { MessageController } from '../../controllers/message';
import { MetricController } from '../../controllers/metric';
import { ModelConnectionsController } from '../../controllers/model-connections';
import { MessageThreadController } from '../../controllers/thread';
import { AiLabelChat } from '../label-chat';
import { handlerAskRawModelToRespondToThread } from './handler-ask-model';
export async function AskAiToRespondToThread(chatId: string, sourceId: string) {
    const chat = await ChatController.getOrThrowByRecordId(chatId);
    const thread = await MessageThreadController.getOrThrowByRecordId(chat?.threadId);
    const messages = await MessageController.listByThreadId(thread.id);

    const [type, id] = sourceId.split('::');

    if (type === 'modelConnections') {
        const model = await ModelConnectionsController.getOrThrowByRecordId(sourceId);

        if (!chat.name) {
            void AiLabelChat({ chat, thread, messages, connection: model });
        }

        return MetricController.withMetrics(
            'ask-raw-model',
            () => handlerAskRawModelToRespondToThread({ chat, thread, messages, connection: model }),
            {
                modelName: model.name,
                provider: model.provider,
                modelId: model.id,
                chatId,
                threadId: thread.id,
                connectionId: model.id,
            }
        );
    }

    if (type === 'agent') {
    }

    throw new Error('Unsupported source type: ' + type);
}
