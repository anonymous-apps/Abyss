import {
    AnthropicLanguageModel,
    ChatThread,
    createZodFromObject,
    GeminiLanguageModel,
    LanguageModel,
    OpenAILanguageModel,
} from '@abyss/intelligence';
import { ToolDefinition } from '@abyss/intelligence/dist/operations/stream-with-tools';
import { AgentRecord } from '../controllers/agent';
import { AgentToolConnectionController } from '../controllers/agent-tool-connection';
import { MessageRecord } from '../controllers/message';
import { ModelConnectionsRecord } from '../controllers/model-connections';
import { TextLogController } from '../controllers/text-log';
import { ToolController } from '../controllers/tool';
import { ToolInvocationController } from '../controllers/tool-invocation';

export function buildIntelegence(aiConnection: ModelConnectionsRecord) {
    let languageModel: LanguageModel | undefined;

    if (aiConnection.provider === 'Gemini') {
        languageModel = new GeminiLanguageModel({
            modelId: aiConnection.modelId,
            apiKey: (aiConnection.data as any)['apiKey'],
        });
    }

    if (aiConnection.provider === 'OpenAI') {
        languageModel = new OpenAILanguageModel({
            modelId: aiConnection.modelId,
            apiKey: (aiConnection.data as any)['apiKey'],
        });
    }

    if (aiConnection.provider === 'Anthropic') {
        languageModel = new AnthropicLanguageModel({
            modelId: aiConnection.modelId,
            apiKey: (aiConnection.data as any)['apiKey'],
        });
    }

    if (!languageModel) {
        throw new Error('Unsupported AI provider');
    }

    return languageModel;
}

export async function buildThread(messages: MessageRecord[]) {
    let context = ChatThread.empty();

    for (const message of messages) {
        if (message.sourceId === 'USER') {
            if ('text' in message.content) {
                context = context.addPartialWithSender('user', message.content);
            } else {
                throw new Error('Unsupported message content ' + JSON.stringify(message.content));
            }
        } else if (message.sourceId === 'SYSTEM') {
            if ('text' in message.content) {
                context = context.addPartialWithSender('bot', message.content);
            } else if ('toolDefinitionAdded' in message.content) {
                context = context.addPartialWithSender('bot', {
                    type: 'toolDefinitionAdded',
                    toolDefinitionAdded: { toolDefinitions: message.content.toolDefinitionAdded.toolDefinitions },
                });
            } else if ('toolDefinitionRemoved' in message.content) {
                context = context.addPartialWithSender('bot', {
                    type: 'toolDefinitionRemoved',
                    toolDefinitionRemoved: { toolDefinitions: message.content.toolDefinitionRemoved.toolDefinitions },
                });
            } else {
                throw new Error('Unsupported message content ' + JSON.stringify(message.content));
            }
        } else {
            if ('text' in message.content) {
                context = context.addPartialWithSender('bot', message.content);
            } else if ('toolRequest' in message.content) {
                const toolCall = await ToolInvocationController.getByRecordId(message.content.toolRequest.callId);
                const toolOutput = await TextLogController.getByRecordId(toolCall?.textLogId);

                context = context.addPartialWithSender('bot', {
                    type: 'toolResponse',
                    toolResponse: { callId: message.id, output: toolOutput?.text || '' },
                });
            } else {
                throw new Error('Unsupported message content ' + JSON.stringify(message.content));
            }
        }
    }

    return context;
}

export async function buildToolDefinitionsForAgent(agent: AgentRecord) {
    const toolConnections = await AgentToolConnectionController.findByAgentId(agent.id);
    const toolDefinitions: ToolDefinition[] = [];
    for (const toolConnection of toolConnections) {
        const tool = await ToolController.getByRecordId(toolConnection.tool.id);
        if (tool) {
            toolDefinitions.push({
                name: tool.name,
                description: tool.description,
                parameters: createZodFromObject(tool.schema),
            });
        }
    }
    return toolDefinitions;
}
