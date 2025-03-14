import {
    DataStorage,
    DataStorageGetInput,
    DataStorageGetResponse,
    DataStorageSetInput,
    DataStorageSetResponse,
} from '../../interfaces/storage';

interface MockedDataStorageOptions {
    initialData?: Record<string, string>;
}

export class MockedDataStorage extends DataStorage {
    private data: Record<string, string | Buffer>;

    constructor(options: MockedDataStorageOptions = {}) {
        super();
        this.data = options.initialData || {};
    }

    public getName(): string {
        return 'mocked-data';
    }

    protected handlePermalink(key: string): string {
        throw new Error('Method not implemented.');
    }

    protected async handleGet(input: DataStorageGetInput): Promise<DataStorageGetResponse> {
        const data = this.data[input.key];
        if (data) {
            return { exists: true, data: data as string };
        } else {
            return { exists: false };
        }
    }

    protected async handleSet(input: DataStorageSetInput): Promise<DataStorageSetResponse> {
        this.data[input.key] = input.value;
        return { key: input.key };
    }
}
