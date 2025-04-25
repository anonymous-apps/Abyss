import { Thread } from '../../../constructs/thread/thread';
import { createXmlFromObject } from '../../../utils/object-to-xml/object-to-xml';
import { buildToolDefinitionPrompt, buildToolPermissionRemovedPrompt } from '../prompts';

export interface GeminiContent {
    parts: {
        text?: string;
        inline_data?: {
            mime_type: string;
            data: string;
        };
    }[];
}

/**
 * Builds a list of Gemini-compatible content objects from a ChatThread
 *
 * @param thread - The chat thread to convert
 * @returns Array of Gemini-formatted content objects
 */
export function buildGeminiContents(thread: Thread): GeminiContent[] {
    const turns = thread.getTurns();
    const contents: GeminiContent[] = [];

    // Convert the chat turns into Gemini API format
    for (const turn of turns) {
        const parts: any[] = [];
        const differedParts: any[] = [];

        for (const partial of turn.partials) {
            if (partial.type === 'text') {
                parts.push({ text: partial.text.content });
            } else if (partial.type === 'image') {
                parts.push({
                    inline_data: {
                        mime_type: 'image/jpeg',
                        data: partial.image.base64Data,
                    },
                });
            } else if (partial.type === 'toolRequest') {
                // Convert tool call to XML and add as text content
                parts.push({ text: createXmlFromObject(partial.toolRequest.name, partial.toolRequest.args) });
                differedParts.push({
                    text: createXmlFromObject('toolCallResult', {
                        callId: partial.toolRequest.callId,
                        name: partial.toolRequest.name,
                        output: 'tool call result here',
                    }),
                });
            } else if (partial.type === 'toolDefinitionAdded') {
                parts.push({ text: buildToolDefinitionPrompt(partial.toolDefinitionAdded.toolDefinitions) });
            } else if (partial.type === 'toolDefinitionRemoved') {
                parts.push({ text: buildToolPermissionRemovedPrompt(partial.toolDefinitionRemoved.toolDefinitions) });
            }
        }

        if (parts.length > 0) {
            contents.push({ parts });
        }

        if (differedParts.length > 0) {
            contents.push({ parts: differedParts });
        }
    }

    return contents;
}
