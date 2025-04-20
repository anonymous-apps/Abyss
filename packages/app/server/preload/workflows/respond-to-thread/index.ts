import { AgentController } from '../../controllers/agent';
import { AgentToolConnectionController } from '../../controllers/agent-tool-connection';
import { ChatController } from '../../controllers/chat';
import { MessageController } from '../../controllers/message';
import { MessageThreadController } from '../../controllers/message-thread';
import { MetricController } from '../../controllers/metric';
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
        const agent = await AgentController.getOrThrowByRecordId(sourceId);
        const model = await ModelConnectionsController.getOrThrowByRecordId(agent.chatModelId);
        const toolConnections = await AgentToolConnectionController.findByAgentId(agent.id);
        return MetricController.withMetrics(
            'ask-agent',
            () => handlerAskAgentToRespondToThread({ chat, thread, messages, connection: model, agent, toolConnections }),
            {
                modelId: model.id,
                modelName: model.name,
                agentName: agent.name,
                provider: model.provider,
                chatId,
                threadId: thread.id,
                connectionId: model.id,
            }
        );
    }

    throw new Error('Unsupported source type: ' + type);
}
