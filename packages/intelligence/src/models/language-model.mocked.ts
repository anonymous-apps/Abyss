import { ChatThread } from '../constructs/chat-thread';
import { AsyncStream } from '../constructs/stream/stream';
import { LanguageModel } from './language-model';

/**
 * A mocked implementation of the LanguageModel for testing
 */
export class MockedLanguageModel extends LanguageModel {
    private responseFunction: (thread: ChatThread) => Promise<ChatThread> | ChatThread;
    private streamResponseFunction: (thread: ChatThread) => AsyncStream<string>;
    /**
     * Creates a new mocked language model instance
     *
     * @param responseFunction Function that maps input thread to output thread
     * @param provider The provider of the language model (default: "mock")
     * @param id The specific model identifier (default: "mocked-model")
     */
    constructor(
        responseFunction: (thread: ChatThread) => Promise<ChatThread>,
        streamResponseFunction: (thread: ChatThread) => AsyncStream<string>,
        provider = 'mock',
        id = 'mocked-model'
    ) {
        super(provider, id);
        this.responseFunction = responseFunction;
        this.streamResponseFunction = streamResponseFunction;
    }

    /**
     * Sets a new response function for the mocked model
     *
     * @param responseFunction Function that maps input thread to output thread
     */
    public setResponseFunction(responseFunction: (thread: ChatThread) => Promise<ChatThread> | ChatThread): void {
        this.responseFunction = responseFunction;
    }

    /**
     * Implementation of the abstract _respond method
     * Uses the provided response function to generate responses
     *
     * @param thread The chat thread to respond to
     * @returns A Promise resolving to the model's response
     */
    protected async _invoke(thread: ChatThread): Promise<ChatThread> {
        return this.responseFunction(thread);
    }

    /**
     * Implementation of the abstract _stream method
     * Uses the provided response function to generate responses
     *
     * @param thread The chat thread to respond to
     * @returns A Promise resolving to an AsyncStream of string chunks
     */
    protected async _stream(thread: ChatThread): Promise<AsyncStream<string>> {
        return this.streamResponseFunction(thread);
    }
}
