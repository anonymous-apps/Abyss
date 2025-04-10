import {
    AnthropicLanguageModel,
    ChatThread,
    createZodFromObject,
    GeminiLanguageModel,
    LanguageModel,
    OpenAILanguageModel,
    ToolDefinition,
} from '@abyss/intelligence';
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
            context = context.addUserTextMessage(message.content.text);
        } else {
            context = context.addBotTextMessage(message.content.text);
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
