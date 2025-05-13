import { CompiledPrompt, PromptTemplate } from '@abyss/prompts';
import { ReferencedMessageThreadRecord, SQliteClient, ToolCallRequestPartial } from '@abyss/records';
import { systemErrorPrompt } from './errors.prompt';
import { toolCallRequestPrompt, toolCallResponsePrompt, toolUseInstructionsPrompt } from './toolCall.prompt';
import { addToolDefinitionPrompt } from './toolDefinition.prompt';

type ConversationTurn = {
    senderId: string;
    prompt: CompiledPrompt;
};

export async function buildConversationPrompt(thread: ReferencedMessageThreadRecord, db: SQliteClient): Promise<ConversationTurn[]> {
    const messages = await thread.getAllMessages();

    let result: ConversationTurn[] = [];
    let currentTurnId = 'user';
    let prompt = new PromptTemplate();
    let hasToolInstructions = false;

    const startNewTurn = (senderId: string) => {
        result.push({ senderId: currentTurnId, prompt: prompt.compile({}) });
        prompt = new PromptTemplate();
        currentTurnId = senderId;
    };

    for (const message of messages) {
        // Start new turn if needed
        if (message.senderId !== currentTurnId) {
            startNewTurn(message.senderId);
        }

        // Add text to prompt
        if (message.type === 'text') {
            prompt.addText(message.payloadData.content);
        }
        if (message.type === 'new-tool-definition') {
            const toolDefinitions = await Promise.all(
                message.payloadData.tools.map(async tool => db.tables.toolDefinition.get(tool.toolId))
            );
            if (toolDefinitions.length > 0) {
                prompt.addSubPrompt(addToolDefinitionPrompt.compile(toolDefinitions));
            }
            if (!hasToolInstructions) {
                prompt.addSubPrompt(toolUseInstructionsPrompt.compile({}));
                hasToolInstructions = true;
            }
        }
        if (message.type === 'tool-call-request') {
            prompt.addSubPrompt(toolCallRequestPrompt.compile(message));
        }
        if (message.type === 'system-error') {
            prompt.addSubPrompt(systemErrorPrompt.compile(message));
        }
        if (message.type === 'tool-call-response') {
            const request = messages.find(
                m => m.type === 'tool-call-request' && m.payloadData.toolCallId === message.payloadData.toolCallId
            );
            if (request) {
                prompt.addSubPrompt(
                    toolCallResponsePrompt.compile({
                        request: request as ToolCallRequestPartial,
                        response: message,
                    })
                );
            }
        }
    }

    startNewTurn('assistant');
    return result;
}
