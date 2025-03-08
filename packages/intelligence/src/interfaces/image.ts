import { hash } from '../utils/random';
import { DataStorage } from './storage';

export interface ImageModelProps {
    storage?: DataStorage;
}

export interface ImageModelInput {
    prompt: string;
}

export interface ImageModelResponse {
    imageBase64: string;
    cachedUrl?: string;
}

export abstract class ImageModel {
    // If we want to store data for this model
    private readonly storage?: DataStorage;

    constructor(props: ImageModelProps = {}) {
        this.storage = props.storage;
    }

    public async generate(input: ImageModelInput): Promise<ImageModelResponse> {
        const callKey = hash(this.getName() + '::' + input.prompt);

        if (this.storage) {
            const dataStore = this.storage;
            const existsInDataStore = await dataStore.get({ key: callKey });
            if (existsInDataStore.exists) {
                return JSON.parse(existsInDataStore.data as string) as ImageModelResponse;
            }
        }

        const modelResponse = await this.handleInvoke({ prompt: input.prompt });

        if (this.storage) {
            // write image to data store
            await this.storage.set({
                key: callKey + '.png',
                value: Buffer.from(modelResponse.imageBase64, 'base64'),
            });
            modelResponse.cachedUrl = this.storage.getPermalink(callKey + '.png');
            // write response to data store
            await this.storage.set({
                key: callKey,
                value: JSON.stringify(modelResponse),
            });
        }

        return modelResponse;
    }

    public abstract getName(): string;
    protected abstract handleInvoke(input: ImageModelInput): Promise<ImageModelResponse>;
}
