import { ChatController } from '../../controllers/chat';
import { MessageController } from '../../controllers/message';
import { MessageThreadController } from '../../controllers/message-thread';
import { ModelConnectionsController } from '../../controllers/model-connections';
import { handlerAskRawModelToRespondToThread } from './handler-ask-raw-model';

export async function AskAiToRespondToThread(chatId: string, sourceId: string) {
    const chat = await ChatController.getOrThrowByRecordId(chatId);
    const thread = await MessageThreadController.getOrThrowByRecordId(chat?.threadId);
    const messages = await MessageController.listByThreadId(thread.id);

    const [type, id] = sourceId.split('::');

    if (type === 'modelConnections') {
        const model = await ModelConnectionsController.getOrThrowByRecordId(sourceId);
        return handlerAskRawModelToRespondToThread({ chat, thread, messages, connection: model });
    }

    throw new Error('Unsupported source type: ' + type);
}
