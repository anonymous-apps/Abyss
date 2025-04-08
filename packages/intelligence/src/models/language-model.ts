import { ChatThread } from '../constructs/chat-thread';
import { AsyncStream } from '../constructs/stream/stream';
import { StorageController } from '../storage';
import { Log } from '../utils/logs';
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
    public async invoke(thread: ChatThread, cache?: StorageController): Promise<ChatThread> {
        try {
            const invokeKey = {
                provider: this.provider,
                model: this.id,
                thread: thread.toLogString(),
            };

            if (cache) {
                Log.debug(this.getName(), `Checking cache for invoke key`);
                const cachedResponse = await cache.read(invokeKey);
                if (cachedResponse) {
                    Log.log(this.getName(), `Found cached response for invoke key, returning cached response instead of invoking model`);
                    return ChatThread.deserialize(cachedResponse as any);
                } else {
                    Log.debug(this.getName(), `No cached response found for invoke key, invoking model`);
                }
            }

            Log.debug(this.getName(), `Invoking model`);
            const response = await this._invoke(thread);
            Log.debug(this.getName(), `Got response from model!`);

            if (cache) {
                Log.debug(this.getName(), `Saving response to cache for future invocations`);
                await cache.save(invokeKey, response.serialize());
            }

            return response;
        } catch (error) {
            Log.error(this.getName(), `Error responding to thread: ${error}`);
            throw error;
        }
    }

    protected abstract _invoke(thread: ChatThread): Promise<ChatThread>;

    /**
     * Stream a response to a chat thread
     *
     * @param thread The chat thread to respond to
     * @returns A Promise resolving to an AsyncStream of string chunks
     */
    public async stream(thread: ChatThread): Promise<AsyncStream<string>> {
        try {
            Log.debug(this.getName(), `Streaming response from model`);
            return await this._stream(thread);
        } catch (error) {
            Log.error(this.getName(), `Error streaming response from thread: ${error}`);
            throw error;
        }
    }

    protected abstract _stream(thread: ChatThread): Promise<AsyncStream<string>>;
}
