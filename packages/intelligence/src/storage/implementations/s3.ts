import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { StorageController } from "../storage-controller";

export interface S3StorageOptions {
    region?: string;
    bucket: string;
    prefix?: string;
}

/**
 * Storage controller implementation using AWS S3
 */
export class S3StorageController extends StorageController {
    private client: S3Client;
    private bucket: string;
    private prefix: string;

    constructor(options: S3StorageOptions) {
        super("aws/s3");

        const region = options.region || "us-west-2";
        this.bucket = options.bucket;
        this.prefix = options.prefix || "";

        this.client = new S3Client({ region });
    }

    private getFullKey(key: string): string {
        return this.prefix ? `${this.prefix}/${key}` : key;
    }

    protected async _exists(key: string): Promise<boolean> {
        try {
            const command = new HeadObjectCommand({
                Bucket: this.bucket,
                Key: this.getFullKey(key),
            });

            await this.client.send(command);
            return true;
        } catch (error) {
            if ((error as any).name === "NotFound") {
                return false;
            }
            throw error;
        }
    }

    protected async _read<T>(key: string): Promise<T | null> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: this.getFullKey(key),
            });

            const response = await this.client.send(command);

            if (!response.Body) {
                return null;
            }

            const bodyContents = await response.Body.transformToString();
            return JSON.parse(bodyContents) as T;
        } catch (error) {
            if ((error as any).name === "NoSuchKey") {
                return null;
            }
            throw error;
        }
    }

    protected async _save<T>(key: string, data: T): Promise<void> {
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: this.getFullKey(key),
            Body: JSON.stringify(data),
            ContentType: "application/json",
        });

        await this.client.send(command);
    }
}
