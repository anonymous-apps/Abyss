import fs from 'fs';
import * as path from 'path';
import {
    DataStorage,
    DataStorageGetInput,
    DataStorageGetResponse,
    DataStorageSetInput,
    DataStorageSetResponse,
} from '../../interfaces/storage';

export class LocalDataStorage extends DataStorage {
    private storagePath: string;

    constructor({ storagePath }: { storagePath: string }) {
        super();
        this.storagePath = storagePath;
    }

    public getName(): string {
        return 'local-storage';
    }

    protected handlePermalink(key: string): string {
        return path.join(this.storagePath, key);
    }

    protected async handleGet(input: DataStorageGetInput): Promise<DataStorageGetResponse> {
        try {
            const filePath = path.join(this.storagePath, input.key);
            const data = await fs.promises.readFile(filePath, 'utf-8');
            return { exists: true, data: data };
        } catch (error) {
            return { exists: false };
        }
    }

    protected async handleSet(input: DataStorageSetInput): Promise<DataStorageSetResponse> {
        const filePath = path.join(this.storagePath, input.key);
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
        await fs.promises.writeFile(filePath, input.value, 'utf-8');
        return { key: input.key };
    }
}
