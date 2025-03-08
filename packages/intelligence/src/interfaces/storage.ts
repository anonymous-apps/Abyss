import { Log } from '../utils/logs';
import { randomId } from '../utils/random';

export interface DataStorageGetInput {
    key: string;
}

export interface DataStorageSetRandomInput {
    data: string | Buffer;
}

export interface DataStorageSetInput {
    key: string;
    value: string | Buffer;
}

export interface DataStorageGetResponse {
    exists: boolean;
    data?: string;
}

export interface DataStorageSetResponse {
    key: string;
}

export abstract class DataStorage {
    public getName(): string {
        return 'unknown';
    }

    public async setRandomid(data: DataStorageSetRandomInput): Promise<DataStorageSetResponse> {
        const randomid = randomId();
        return await this.set({
            key: randomid,
            value: data.data,
        });
    }

    public async get(input: DataStorageGetInput): Promise<DataStorageGetResponse> {
        const result = await this.handleGet(input);
        if (result.exists) {
            Log.log(`Data found in storage for key: ${input.key}`);
        }
        return result;
    }

    public async set(input: DataStorageSetInput): Promise<DataStorageSetResponse> {
        Log.log(`Setting data in storage: ${input.key}`);
        return this.handleSet(input);
    }

    public getPermalink(key: string): string {
        return this.handlePermalink(key);
    }

    protected abstract handlePermalink(key: string): string;
    protected abstract handleGet(input: DataStorageGetInput): Promise<DataStorageGetResponse>;
    protected abstract handleSet(input: DataStorageSetInput): Promise<DataStorageSetResponse>;
}
