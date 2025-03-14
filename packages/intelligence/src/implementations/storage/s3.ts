import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
    DataStorage,
    DataStorageGetInput,
    DataStorageGetResponse,
    DataStorageSetInput,
    DataStorageSetResponse,
} from '../../interfaces/storage';

export class S3DataStorage extends DataStorage {
    private s3Client: S3Client;
    private bucketName: string;
    private region: string;

    constructor({ bucketName, region }: { bucketName: string; region?: string }) {
        super();
        this.bucketName = bucketName;
        this.region = region || 'us-west-2';
        this.s3Client = new S3Client({ region: this.region });
    }

    public getName(): string {
        return 'aws-s3';
    }

    protected handlePermalink(key: string): string {
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    }

    protected async handleGet(input: DataStorageGetInput): Promise<DataStorageGetResponse> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: input.key,
            });
            const response = await this.s3Client.send(command);
            if (!response.Body) {
                return { exists: false };
            }
            const data = await response.Body.transformToString();
            return { exists: true, data };
        } catch (error) {
            return { exists: false };
        }
    }

    protected async handleSet(input: DataStorageSetInput): Promise<DataStorageSetResponse> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: input.key,
            Body: input.value,
        });
        await this.s3Client.send(command);
        return { key: input.key };
    }
}
