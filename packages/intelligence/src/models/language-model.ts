import { Thread } from '../constructs/thread';
import { Log } from '../utils/logs';
import { LanguageModelChatResult } from './types';

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
    public async invoke(thread: Thread): Promise<LanguageModelChatResult> {
        try {
            Log.debug(this.getName(), `Invoking model`);

            // Call the implementation-specific _invoke method
            const result = await this._invoke(thread);

            Log.debug(this.getName(), `Got response from model!`);

            return result;
        } catch (error) {
            Log.error(this.getName(), `Error responding to thread: ${error}`);
            throw error;
        }
    }

    /**
     * Internal method to implement model invocation for a specific model
     * @param thread The chat thread to respond to
     * @returns A Promise resolving to a LanguageModelChatResult
     */
    protected abstract _invoke(thread: Thread): Promise<LanguageModelChatResult>;
}
