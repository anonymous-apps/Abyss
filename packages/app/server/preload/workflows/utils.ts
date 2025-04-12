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
import { ToolController } from '../controllers/tool';

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

export function buildThread(messages: MessageRecord[]) {
    let context = ChatThread.fromStrings();

    for (const message of messages) {
        if (message.sourceId === 'USER') {
            if ('text' in message.content) {
                context = context.addUserTextMessage(message.content.text);
            } else {
                throw new Error('Unsupported message content ' + JSON.stringify(message.content));
            }
        } else {
            if ('text' in message.content) {
                context = context.addBotTextMessage(message.content.text);
            } else if ('tool' in message.content) {
                context = context.addBotToolCallMessage(message.id, message.content.tool.name, message.content.tool.parameters);
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
