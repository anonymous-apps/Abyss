import axios from "axios";
import { ChatThread } from "../../constructs/chat-thread/chat-thread";
import { ChatTurn } from "../../constructs/chat-thread/types";
import { LanguageModel } from "../language-model";

export interface GeminiLanguageModelOptions {
    apiKey?: string;
    modelId?: string;
    enableImageGeneration?: boolean;
}

export class GeminiLanguageModel extends LanguageModel {
    private modelId = "gemini-2.0-flash-exp";
    private apiKey: string;
    private enableImageGeneration: boolean;

    constructor(props: GeminiLanguageModelOptions = {}) {
        // If image generation is enabled, use the appropriate model ID
        const defaultModelId = props.enableImageGeneration ? "gemini-2.0-flash-exp-image-generation" : "gemini-2.0-flash-exp";

        super("gemini", props.modelId || defaultModelId);
        this.apiKey = props.apiKey || (process && process.env.GEMINI_API_KEY) || "";
        this.modelId = props.modelId || defaultModelId;
        this.enableImageGeneration = props.enableImageGeneration || true;
    }

    protected override async _respond(thread: ChatThread): Promise<ChatThread> {
        const turns = thread.getTurns();

        // Convert the chat turns into Gemini API format
        // Each turn becomes a separate item in the contents array
        const contents = turns.map((turn: ChatTurn) => {
            const parts = turn.partials
                .map((partial) => {
                    if (partial.type === "text") {
                        return { text: partial.content };
                    } else if (partial.type === "image") {
                        return {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: partial.base64Data,
                            },
                        };
                    }
                    return null;
                })
                .filter(Boolean);

            return { parts };
        });

        // Set appropriate generation config
        const generationConfig = this.enableImageGeneration ? { responseModalities: ["Text", "Image"] } : { responseModalities: ["Text"] };

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/${this.modelId}:generateContent?key=${this.apiKey}`,
                {
                    contents,
                    generationConfig,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Handle response that may contain text and/or images
            const candidates = response.data.candidates || [];
            if (!candidates.length) {
                throw new Error("No response generated from Gemini API");
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
                console.error("Gemini API error:", error.response?.data || error.message);
            } else {
                console.error("Unexpected error:", error);
            }
            throw error;
        }
    }
}
