import { ChatThread } from '../constructs/chat-thread';
import { Log } from '../utils/logs';
import { LanguageModelChatResult, LanguageModelStreamResult } from './types';

/**
 * Abstract base class for language models
 */
export abstract class LanguageModel {
    readonly provider: string;
    readonly id: string;

    /**
     * Creates a new language model instance
     *
     * @param provider The provider of the language model (e.g., "openai", "anthropic")
     * @param id The specific model identifier
     */
    constructor(provider: string, id: string) {
        this.provider = provider;
        this.id = id;
    }

    /**
     * Get the provider name
     */
    getProvider(): string {
        return this.provider;
    }

    /**
     * Get the model identifier
     */
    getModelId(): string {
        return this.id;
    }

    /**
     * Get the full name of the model, combining provider and model ID
     *
     * @returns A string in the format "provider/model-id"
     */
    getName(): string {
        return `${this.provider}/${this.id}`;
    }

    /**
     * Respond to a chat thread
     *
     * @param thread The chat thread to respond to
     * @returns A Promise resolving to the model's response
     */
    public async invoke(thread: ChatThread): Promise<LanguageModelChatResult> {
        try {
            Log.debug(this.getName(), `Invoking model via streaming`);

            // Use streaming to get the response
            const stream = await this._stream(thread);
            let responseText = '';

            // Collect all chunks from the stream
            for await (const chunk of stream.stream) {
                responseText += chunk;
            }

            // Create a new thread with the response
            const response = thread.addBotTextMessage(responseText);
            Log.debug(this.getName(), `Got response from model!`);

            return {
                metadata: stream.metadata,
                response: responseText,
                outputThread: response,
            };
        } catch (error) {
            Log.error(this.getName(), `Error responding to thread: ${error}`);
            throw error;
        }
    }

    /**
     * Stream a response to a chat thread
     *
     * @param thread The chat thread to respond to
     * @returns A Promise resolving to an AsyncStream of string chunks
     */
    public async stream(thread: ChatThread): Promise<LanguageModelStreamResult> {
        try {
            Log.debug(this.getName(), `Streaming response from model`);
            return await this._stream(thread);
        } catch (error) {
            Log.error(this.getName(), `Error streaming response from thread: ${error}`);
            throw error;
        }
    }

    /**
     * Internal method to implement streaming for a specific model
     * @param thread The chat thread to respond to
     * @returns A Promise resolving to an AsyncStream of string chunks
     */
    protected abstract _stream(thread: ChatThread): Promise<LanguageModelStreamResult>;
}
