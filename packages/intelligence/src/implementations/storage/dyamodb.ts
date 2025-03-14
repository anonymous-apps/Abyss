import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import {
    DataStorage,
    DataStorageGetInput,
    DataStorageGetResponse,
    DataStorageSetInput,
    DataStorageSetResponse,
} from '../../interfaces/storage';

export class DynamoDBDataStorage extends DataStorage {
    private dynamoDBClient: DynamoDBDocumentClient;
    private tableName: string;

    constructor({ tableName, region }: { tableName: string; region?: string }) {
        super();
        this.tableName = tableName;
        const client = new DynamoDBClient({ region: region || 'us-west-2' });
        this.dynamoDBClient = DynamoDBDocumentClient.from(client);
    }

    public getName(): string {
        return 'aws-dynamodb';
    }

    protected async handleGet(input: DataStorageGetInput): Promise<DataStorageGetResponse> {
        try {
            const command = new GetCommand({
                TableName: this.tableName,
                Key: { id: input.key },
            });
            const response = await this.dynamoDBClient.send(command);
            if (!response.Item) {
                return { exists: false };
            }
            const data = response.Item.value;
            return { exists: true, data };
        } catch (error) {
            return { exists: false };
        }
    }

    protected async handleSet(input: DataStorageSetInput): Promise<DataStorageSetResponse> {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: {
                id: input.key,
                value: input.value,
            },
        });
        await this.dynamoDBClient.send(command);
        return { key: input.key };
    }

    protected handlePermalink(key: string): string {
        throw new Error('Method not implemented.');
    }
}
