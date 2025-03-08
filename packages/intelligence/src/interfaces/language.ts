import { ApiCall, IntelegenceLogger } from '../framework/types';
import { ChatContext } from '../utils/chat-context';
import { dedent } from '../utils/dedent';
import { Log } from '../utils/logs';
import { hash } from '../utils/random';
import { DataStorage } from './storage';

export interface LanguageModelProps {
    storage?: DataStorage;
}

export interface LanguageModelInvokeProps {
    chat: ChatContext;
}

export interface LanguageModelResponse {
    response: string;
    apiCall?: ApiCall;
}

export abstract class LanguageModel {
    // If we want to store data for this model
    private readonly storage?: DataStorage;

    constructor(props: LanguageModelProps = {}) {
        this.storage = props.storage;
    }

    // Name this model
    protected abstract getName(): string;

    public async invoke(props: LanguageModelInvokeProps): Promise<LanguageModelResponse> {
        const storageKey = hash(`${this.getName()}-${props.chat.toString()}`);

        // If we want to use the storage cache for this model call
        if (this.storage) {
            Log.debug(`Checking storage cache for language model ${this.getName()}`);
            const cached = await this.storage.get({ key: storageKey });
            if (cached.exists) {
                Log.log(`Returning cached language model ${this.getName()}`);
                return JSON.parse(cached.data as string) as LanguageModelResponse;
            }
        }

        // Invoke the model
        Log.debug(`Invoking language model ${this.getName()}: ${dedent(props.chat.toString())}`);
        const result = await this.handleInvoke(props);
        Log.debug(`Language model ${this.getName()} returned: ${dedent(result.response)}`);

        // If we want to store the result in the cache
        if (this.storage) {
            Log.debug(`Storing language model ${this.getName()} in storage`);
            await this.storage.set({
                key: storageKey,
                value: JSON.stringify(result),
            });
        }

        // Return the result
        return result;
    }

    protected abstract handleInvoke(props: LanguageModelInvokeProps): Promise<LanguageModelResponse>;
}
