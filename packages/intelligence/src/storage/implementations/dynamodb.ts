import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { StorageController } from "../storage-controller";

export interface DynamoDBStorageOptions {
    region?: string;
    tableName: string;
}

/**
 * Storage controller implementation using AWS DynamoDB
 */
export class DynamoDBStorageController extends StorageController {
    private client: DynamoDBDocumentClient;
    private tableName: string;
    private hashKeyName: string = "id";

    constructor(options: DynamoDBStorageOptions) {
        super("aws/dynamodb");

        const region = options.region || "us-west-2";
        this.tableName = options.tableName;

        const dynamoClient = new DynamoDBClient({ region });
        this.client = DynamoDBDocumentClient.from(dynamoClient);
    }

    protected async _exists(key: string): Promise<boolean> {
        try {
            const command = new GetCommand({
                TableName: this.tableName,
                Key: {
                    [this.hashKeyName]: key,
                },
                ProjectionExpression: this.hashKeyName,
            });

            const response = await this.client.send(command);
            return !!response.Item;
        } catch (error) {
            console.error("DynamoDB exists error:", error);
            throw error;
        }
    }

    protected async _read<T>(key: string): Promise<T | null> {
        try {
            const command = new GetCommand({
                TableName: this.tableName,
                Key: {
                    [this.hashKeyName]: key,
                },
            });

            const response = await this.client.send(command);

            if (!response.Item) {
                return null;
            }

            // We store the data in a "data" attribute to separate it from DynamoDB metadata
            return response.Item.data as T;
        } catch (error) {
            console.error("DynamoDB read error:", error);
            throw error;
        }
    }

    protected async _save<T>(key: string, data: T): Promise<void> {
        try {
            const command = new PutCommand({
                TableName: this.tableName,
                Item: {
                    [this.hashKeyName]: key,
                    data: data,
                    createdAt: new Date().toISOString(),
                },
            });

            await this.client.send(command);
        } catch (error) {
            console.error("DynamoDB save error:", error);
            throw error;
        }
    }
}
