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

    let hasNewToolDefinition = false;
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
        }
    }

    const activeToolDefinitions = await thread.getAllActiveToolDefinitions();

    if (!!activeToolDefinitions.length) {
        prompt.addText(`
            Here is how you can use the tools you have been given:
            Respond with XML in the format of 
            <tool-name-1>
                <param-name-1>param-value-1</param-name-1>
                <param-name-2>param-value-2</param-name-2>
                ...
            </tool-name-1>
            <tool-name-2>
                <param-name-1>param-value-1</param-name-1>
                <param-name-2>param-value-2</param-name-2>
                ...
            </tool-name-2>
            ...
            (Note: There may be no parameters for a tool)
            With that format, we will be able to use the tool in the next turn.
        `);
    }

    startNewTurn('assistant');
    return result;
}
