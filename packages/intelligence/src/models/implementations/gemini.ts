import { ChatThread } from '../../constructs/chat-thread/chat-thread';
import { Log } from '../../utils/logs';
import { createXmlFromObject } from '../../utils/object-to-xml/object-to-xml';
import { LanguageModel } from '../language-model';
import { LanguageModelChatResult } from '../types';

export interface GeminiLanguageModelOptions {
    apiKey?: string;
    modelId?: string;
    enableImageGeneration?: boolean;
}

interface GeminiContent {
    parts: {
        text?: string;
        inline_data?: {
            mime_type: string;
            data: string;
        };
    }[];
}

interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
    usageMetadata?: {
        promptTokenCount: number;
        candidatesTokenCount: number;
        totalTokenCount: number;
    };
}

export class GeminiLanguageModel extends LanguageModel {
    private modelId = 'gemini-2.0-flash-exp';
    private apiKey: string;
    private enableImageGeneration: boolean;

    constructor(props: GeminiLanguageModelOptions = {}) {
        // If image generation is enabled, use the appropriate model ID
        const defaultModelId = props.enableImageGeneration ? 'gemini-2.0-flash-exp-image-generation' : 'gemini-2.0-flash-exp';

        super('gemini', props.modelId || defaultModelId);
        this.apiKey = props.apiKey || (process && process.env.GEMINI_API_KEY) || '';
        this.modelId = props.modelId || defaultModelId;
        this.enableImageGeneration = props.enableImageGeneration || true;
    }

    private buildContents(thread: ChatThread): GeminiContent[] {
        const turns = thread.getTurns();
        const contents: GeminiContent[] = [];

        // Convert the chat turns into Gemini API format
        for (const turn of turns) {
            const parts: any[] = [];
            const differedParts: any[] = [];

            for (const partial of turn.partials) {
                if (partial.type === 'text') {
                    parts.push({ text: partial.content });
                } else if (partial.type === 'image') {
                    parts.push({
                        inline_data: {
                            mime_type: 'image/jpeg',
                            data: partial.base64Data,
                        },
                    });
                } else if (partial.type === 'toolCall') {
                    // Convert tool call to XML and add as text content
                    parts.push({ text: createXmlFromObject(partial.name, partial.args) });
                    differedParts.push({
                        text: createXmlFromObject('toolCallResult', {
                            callId: partial.callId,
                            name: partial.name,
                            output: partial.output,
                        }),
                    });
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

    protected async _invoke(thread: ChatThread): Promise<LanguageModelChatResult> {
        const contents = this.buildContents(thread);
        const modelName = this.getName();
        const startTime = Date.now();

        // Set appropriate generation config
        const generationConfig = this.enableImageGeneration ? { responseModalities: ['Text', 'Image'] } : { responseModalities: ['Text'] };

        try {
            // Create the fetch request
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${this.modelId}:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents,
                        generationConfig,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            const parsed = JSON.parse(JSON.stringify(responseData)) as GeminiResponse;

            if (!parsed?.candidates?.[0]?.content?.parts?.[0]?.text) {
                throw new Error('No content in Gemini response');
            }

            const responseText = parsed.candidates[0].content.parts[0].text;

            // Create metrics
            const metrics = {
                inputTokens: parsed.usageMetadata?.promptTokenCount || 0,
                outputTokens: parsed.usageMetadata?.candidatesTokenCount || 0,
                totalTokens: parsed.usageMetadata?.totalTokenCount || 0,
            };

            // Return the result
            return {
                inputContext: contents,
                response: responseText,
                metrics: metrics,
            };
        } catch (error) {
            Log.error(modelName, `Error: ${error}`);
            throw error;
        }
    }
}
