import { Thread } from '../constructs/thread';
import { LanguageModel } from './language-model';
import { LanguageModelChatResult } from './types';

/**
 * A mocked implementation of the LanguageModel for testing
 */
export class MockedLanguageModel extends LanguageModel {
    private responseFunction: (thread: Thread) => Promise<LanguageModelChatResult> | LanguageModelChatResult;
    /**
     * Creates a new mocked language model instance
     *
     * @param responseFunction Function that maps input thread to output thread
     * @param provider The provider of the language model (default: "mock")
     * @param id The specific model identifier (default: "mocked-model")
     */
    constructor(
        responseFunction: (thread: Thread) => Promise<LanguageModelChatResult> | LanguageModelChatResult,
        provider = 'mock',
        id = 'mocked-model'
    ) {
        super(provider, id);
        this.responseFunction = responseFunction;
    }

    /**
     * Sets a new response function for the mocked model
     *
     * @param responseFunction Function that maps input thread to output thread
     */
    public setResponseFunction(responseFunction: (thread: Thread) => Promise<LanguageModelChatResult> | LanguageModelChatResult): void {
        this.responseFunction = responseFunction;
    }

    /**
     * Implementation of the abstract _respond method
     * Uses the provided response function to generate responses
     *
     * @param thread The chat thread to respond to
     * @returns A Promise resolving to the model's response
     */
    public async invoke(thread: Thread): Promise<LanguageModelChatResult> {
        return this.responseFunction(thread);
    }

    /**
     * Implementation of the abstract _stream method
     * Uses the provided response function to generate responses
     *
     * @param thread The chat thread to respond to
     * @returns A Promise resolving to an AsyncStream of string chunks
     */
    protected async _invoke(thread: Thread): Promise<LanguageModelChatResult> {
        return {
            inputContext: [],
            response: '',
            metrics: {},
        };
    }
}
