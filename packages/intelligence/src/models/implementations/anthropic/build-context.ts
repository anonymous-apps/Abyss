import { ChatThread } from '../../../constructs/chat-thread/chat-thread';
import { createXmlFromObject } from '../../../utils/object-to-xml/object-to-xml';
import { buildToolDefinitionPrompt, buildToolPermissionRemovedPrompt } from '../prompts';

export interface AnthropicMessage {
    role: 'user' | 'assistant';
    content: string | AnthropicContent[];
}

export interface AnthropicContent {
    type: 'text' | 'image';
    text?: string;
    source?: {
        type: 'base64';
        media_type: string;
        data: string;
    };
}

/**
 * Builds a list of Anthropic-compatible messages from a ChatThread
 *
 * @param thread - The chat thread to convert
 * @param enableVision - Whether vision capabilities are enabled
 * @returns Array of Anthropic-formatted messages
 */
export function buildAnthropicMessages(thread: ChatThread, enableVision: boolean): AnthropicMessage[] {
    const turns = thread.getTurns();
    const messages: AnthropicMessage[] = [];

    // Convert the chat turns into Anthropic API format
    for (const turn of turns) {
        const role = turn.sender === 'bot' ? 'assistant' : 'user';
        const content: AnthropicContent[] = [];
        const differeedContent: AnthropicContent[] = [];

        for (const partial of turn.partials) {
            if (partial.type === 'text') {
                content.push({ type: 'text', text: partial.text.content });
            } else if (partial.type === 'image' && enableVision) {
                content.push({
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: 'image/jpeg',
                        data: partial.image.base64Data,
                    },
                });
            } else if (partial.type === 'toolRequest') {
                // Convert tool call to XML and add as text content
                content.push({ type: 'text', text: createXmlFromObject(partial.toolRequest.name, partial.toolRequest.args) });
                differeedContent.push({
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
            messages.push({ role, content: content[0].text || '' });
        } else if (content.length > 0) {
            messages.push({ role, content });
        }

        if (differeedContent.length > 0) {
            const otherRole = role === 'user' ? 'assistant' : 'user';
            messages.push({ role: otherRole, content: differeedContent });
        }
    }

    return messages;
}
