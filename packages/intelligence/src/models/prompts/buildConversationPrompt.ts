import { CompiledPrompt, PromptTemplate } from '@abyss/prompts';
import { ReferencedMessageThreadRecord, SQliteClient } from '@abyss/records';
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
            prompt.addSubPrompt(addToolDefinitionPrompt.compile(toolDefinitions));
        }
    }

    return result;
}
