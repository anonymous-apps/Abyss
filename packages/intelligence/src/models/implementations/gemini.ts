import { AsyncStream } from '../../constructs';
import { ChatThread } from '../../constructs/chat-thread/chat-thread';
import { ChatTurn } from '../../constructs/chat-thread/types';
import { Log } from '../../utils/logs';
import { createStreamingFetch } from '../../utils/network/fetch-utils';
import { createGenericStreamParser, parseJSON } from '../../utils/network/stream-parser';
import { LanguageModel } from '../language-model';

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

interface GeminiStreamResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
}

export class GeminiLanguageModel extends LanguageModel {
    private modelId = 'gemini-2.0-flash-exp';
    private apiKey: string;
    private enableImageGeneration: boolean;
    private accumulatedData: string = '';
    private stack: string[] = [];
    private objectStartIndex: number = -1;

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

        // Convert the chat turns into Gemini API format
        // Each turn becomes a separate item in the contents array
        const contents = turns.map((turn: ChatTurn) => {
            const parts = turn.partials
                .map(partial => {
                    if (partial.type === 'text') {
                        return { text: partial.content };
                    } else if (partial.type === 'image') {
                        return {
                            inline_data: {
                                mime_type: 'image/jpeg',
                                data: partial.base64Data,
                            },
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            return { parts };
        });

        return contents as GeminiContent[];
    }

    protected async _stream(thread: ChatThread): Promise<AsyncStream<string>> {
        const contents = this.buildContents(thread);
        const modelName = this.getName();

        // Set appropriate generation config
        const generationConfig = this.enableImageGeneration ? { responseModalities: ['Text', 'Image'] } : { responseModalities: ['Text'] };

        try {
            // Create the fetch request
            const response = await createStreamingFetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${this.modelId}:streamGenerateContent?key=${this.apiKey}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents,
                        generationConfig,
                    }),
                },
                modelName
            );

            if (!response.body) {
                throw new Error('Response body is null');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Create a parser function for Gemini's streaming format
            const parseGeminiChunk = (chunk: string): string | null => {
                try {
                    this.accumulatedData += chunk;
                    let result: string | null = null;

                    // Process each character
                    for (let i = 0; i < chunk.length; i++) {
                        const char = chunk[i];

                        if (char === '[' || char === '{') {
                            if (char === '{' && this.stack.length === 1) {
                                // Start of an object inside the array
                                this.objectStartIndex = this.accumulatedData.length - chunk.length + i;
                            }
                            this.stack.push(char);
                        } else if (char === ']' || char === '}') {
                            const lastOpen = this.stack.pop();
                            if (!lastOpen) continue;

                            // If we just closed an object inside the array
                            if (char === '}' && this.stack.length === 1 && this.stack[0] === '[' && this.objectStartIndex !== -1) {
                                try {
                                    const objectStr = this.accumulatedData.substring(
                                        this.objectStartIndex,
                                        this.accumulatedData.length - chunk.length + i + 1
                                    );
                                    const parsed = parseJSON<GeminiStreamResponse>(objectStr);
                                    if (parsed?.candidates?.[0]?.content?.parts?.[0]?.text) {
                                        result = parsed.candidates[0].content.parts[0].text;
                                    }
                                } catch (error) {
                                    Log.debug(modelName, `Failed to parse object: ${error}`);
                                }
                                this.objectStartIndex = -1;
                            }

                            // If we just closed the array, reset everything
                            if (char === ']' && this.stack.length === 0) {
                                this.accumulatedData = '';
                                this.objectStartIndex = -1;
                            }
                        }
                    }

                    return result;
                } catch (error) {
                    Log.debug(modelName, `Failed to parse chunk: ${error}`);
                    return null;
                }
            };

            // Use the generic stream parser
            return createGenericStreamParser(reader, decoder, modelName, parseGeminiChunk);
        } catch (error) {
            Log.error(modelName, `Streaming error: ${error}`);
            throw error;
        }
    }
}
