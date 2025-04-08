import axios from 'axios';
import { AsyncStream } from '../../constructs';
import { ChatThread } from '../../constructs/chat-thread/chat-thread';
import { ChatTurn } from '../../constructs/chat-thread/types';
import { Log } from '../../utils/logs';
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

    protected override async _invoke(thread: ChatThread): Promise<ChatThread> {
        const contents = this.buildContents(thread);

        // Set appropriate generation config
        const generationConfig = this.enableImageGeneration ? { responseModalities: ['Text', 'Image'] } : { responseModalities: ['Text'] };

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/${this.modelId}:generateContent?key=${this.apiKey}`,
                {
                    contents,
                    generationConfig,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Handle response that may contain text and/or images
            const candidates = response.data.candidates || [];
            if (!candidates.length) {
                throw new Error('No response generated from Gemini API');
            }

            const responseParts = candidates[0].content.parts || [];
            let thread_with_response = thread;

            for (const part of responseParts) {
                if (part.text) {
                    thread_with_response = thread_with_response.addBotTextMessage(part.text);
                } else if (part.inlineData) {
                    thread_with_response = thread_with_response.addBotImageMessage(part.inlineData.data);
                }
            }

            return thread_with_response;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Gemini API error:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
            throw error;
        }
    }

    protected override async _stream(thread: ChatThread): Promise<AsyncStream<string>> {
        const contents = this.buildContents(thread);
        const stream = new AsyncStream<string>();

        // Set appropriate generation config
        const generationConfig = this.enableImageGeneration ? { responseModalities: ['Text', 'Image'] } : { responseModalities: ['Text'] };

        (async () => {
            try {
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/${this.modelId}:streamGenerateContent?key=${this.apiKey}`,
                    {
                        contents,
                        generationConfig,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        responseType: 'stream',
                    }
                );

                // Buffer to accumulate the entire JSON response
                let buffer = '';

                // Process the stream
                response.data.on('data', (chunk: Buffer) => {
                    // Add the new chunk to our buffer
                    buffer += chunk.toString();

                    // Try to find complete JSON objects in the buffer
                    // The Gemini API seems to send a large JSON object line by line
                    // We need to accumulate until we have a complete JSON object

                    // Look for the end of a complete JSON object
                    let endBraceIndex = buffer.lastIndexOf('}');
                    if (endBraceIndex !== -1) {
                        // Find the matching opening brace
                        let openBraces = 0;
                        let startBraceIndex = -1;

                        for (let i = 0; i <= endBraceIndex; i++) {
                            if (buffer[i] === '{') {
                                openBraces++;
                                if (startBraceIndex === -1) {
                                    startBraceIndex = i;
                                }
                            } else if (buffer[i] === '}') {
                                openBraces--;
                                if (openBraces === 0 && i === endBraceIndex) {
                                    // We found a complete JSON object
                                    const jsonStr = buffer.substring(startBraceIndex, endBraceIndex + 1);

                                    try {
                                        const data = JSON.parse(jsonStr);
                                        // Process the parsed data
                                        if (data.candidates && data.candidates.length > 0) {
                                            const candidate = data.candidates[0];
                                            if (candidate.content && candidate.content.parts) {
                                                for (const part of candidate.content.parts) {
                                                    if (part.text) {
                                                        stream.push(part.text);
                                                    }
                                                }
                                            }
                                        }

                                        // Remove the processed JSON object from the buffer
                                        buffer = buffer.substring(endBraceIndex + 1);
                                    } catch (error) {
                                        // If we can't parse this as JSON, it might not be complete yet
                                        Log.debug(this.getName(), `Failed to parse JSON: ${error}`);
                                    }
                                }
                            }
                        }
                    }
                });

                response.data.on('end', () => {
                    buffer = buffer.trim();

                    if (buffer.endsWith(']')) {
                        buffer = buffer.slice(0, -1);
                    }

                    // Process any remaining data in the buffer
                    if (buffer) {
                        try {
                            // If the buffer ends with a ] then remove it
                            // Try to parse the entire buffer as a single JSON object
                            const data = JSON.parse(buffer);

                            if (data.candidates && data.candidates.length > 0) {
                                const candidate = data.candidates[0];
                                if (candidate.content && candidate.content.parts) {
                                    for (const part of candidate.content.parts) {
                                        if (part.text) {
                                            Log.debug(this.getName(), `Received final chunk: ${part.text}`);
                                            stream.push(part.text);
                                        }
                                    }
                                }
                            }
                        } catch (error) {
                            Log.warn(this.getName(), `Failed to parse final buffer: ${error}`);
                        }
                    }

                    stream.close();
                });

                response.data.on('error', (error: Error) => {
                    Log.error(this.getName(), `Stream error: ${error}`);
                    stream.setError(error);
                });
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    Log.error(this.getName(), `Gemini API error: ${error.response?.data || error.message}`);
                } else {
                    Log.error(this.getName(), `Unexpected error: ${error}`);
                }
                stream.setError(error as Error);
            }
        })();

        return stream;
    }
}
