import { Thread } from '../../../constructs/thread/thread';
import { createXmlFromObject } from '../../../utils/object-to-xml/object-to-xml';
import { buildToolDefinitionPrompt, buildToolPermissionRemovedPrompt } from '../prompts';
export interface OpenAIMessage {
    role: 'system' | 'user' | 'assistant';
    content: any[];
}

/**
 * Builds a list of OpenAI-compatible messages from a ChatThread
 *
 * @param thread - The chat thread to convert
 * @param enableVision - Whether vision capabilities are enabled
 * @returns Array of OpenAI-formatted messages
 */
export function buildOpenAIMessages(thread: Thread): OpenAIMessage[] {
    const turns = thread.getTurns();
    const messages: OpenAIMessage[] = [];

    // Convert the chat turns into OpenAI API format
    for (const turn of turns) {
        const role = turn.sender === 'bot' ? 'assistant' : 'user';
        const content: any[] = [];
        const differedMessages: any[] = [];

        for (const partial of turn.partials) {
            if (partial.type === 'text') {
                content.push({ type: 'text', text: partial.text.content });
            } else if (partial.type === 'image') {
                content.push({
                    type: 'image_url',
                    image_url: {
                        url: `data:image/jpeg;base64,${partial.image.base64Data}`,
                    },
                });
            } else if (partial.type === 'toolRequest') {
                content.push({ type: 'text', text: createXmlFromObject(partial.toolRequest.name, partial.toolRequest.args) });
                differedMessages.push({
                    type: 'text',
                    text: createXmlFromObject('toolCallResult', {
                        callId: partial.toolRequest.callId,
                        name: partial.toolRequest.name,
                        output: 'tool call result here',
                    }),
                });
            } else if (partial.type === 'toolDefinitionAdded') {
                content.push({ type: 'text', text: buildToolDefinitionPrompt(partial.toolDefinitionAdded.toolDefinitions) });
            } else if (partial.type === 'toolDefinitionRemoved') {
                content.push({ type: 'text', text: buildToolPermissionRemovedPrompt(partial.toolDefinitionRemoved.toolDefinitions) });
            }
        }

        // If content only has text and it's the only item, simplify to string format
        if (content.length === 1 && content[0].type === 'text') {
            messages.push({ role, content: content[0].text });
        } else if (content.length > 0) {
            messages.push({ role, content });
        }

        if (differedMessages.length > 0) {
            const otherRole = role === 'user' ? 'assistant' : 'user';
            messages.push({ role: otherRole, content: differedMessages });
        }
    }

    return messages;
}
