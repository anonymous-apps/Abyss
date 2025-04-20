import { AgentController } from '../../controllers/agent';
import { AgentToolConnectionController } from '../../controllers/agent-tool-connection';
import { ChatController } from '../../controllers/chat';
import { MessageController } from '../../controllers/message';
import { MessageThreadController } from '../../controllers/message-thread';
import { ModelConnectionsController } from '../../controllers/model-connections';
import { handlerAskAgentToRespondToThread } from './handler-ask-agent';
import { handlerAskRawModelToRespondToThread } from './handler-ask-model';

export async function AskAiToRespondToThread(chatId: string, sourceId: string) {
    const chat = await ChatController.getOrThrowByRecordId(chatId);
    const thread = await MessageThreadController.getOrThrowByRecordId(chat?.threadId);
    const messages = await MessageController.listByThreadId(thread.id);

    const [type, id] = sourceId.split('::');

    if (type === 'modelConnections') {
        const model = await ModelConnectionsController.getOrThrowByRecordId(sourceId);
        return handlerAskRawModelToRespondToThread({ chat, thread, messages, connection: model });
    }

    if (type === 'agent') {
        const agent = await AgentController.getOrThrowByRecordId(sourceId);
        const model = await ModelConnectionsController.getOrThrowByRecordId(agent.chatModelId);
        const toolConnections = await AgentToolConnectionController.findByAgentId(agent.id);
        return handlerAskAgentToRespondToThread({ chat, thread, messages, connection: model, agent, toolConnections });
    }

    throw new Error('Unsupported source type: ' + type);
}
