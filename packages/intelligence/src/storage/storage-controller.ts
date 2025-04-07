import crypto from "crypto";

export abstract class StorageController {
    readonly provider: string;

    /**
     * Creates a new storage controller instance
     *
     * @param provider The provider of the storage (e.g., "s3", "dynamodb")
     */
    constructor(provider: string) {
        this.provider = provider;
    }

    /**
     * Get the provider name
     */
    getProvider(): string {
        return this.provider;
    }

    private generateKey(data: any): string {
        const stableString = JSON.stringify(data);
        return crypto.createHash("sha256").update(stableString).digest("hex");
    }

    /**
     * Check if data exists in storage
     *
     * @param key The key to check
     * @returns A Promise resolving to a boolean indicating existence
     */
    public async exists(key: any): Promise<boolean> {
        try {
            const keyString = this.generateKey(key);
            return this._exists(keyString);
        } catch (error) {
            console.error(`Error checking existence: ${error}`);
            throw error;
        }
    }
    protected abstract _exists(key: string): Promise<boolean>;

    /**
     * Check if data exists in storage using raw string key
     *
     * @param key The string key to check
     * @returns A Promise resolving to a boolean indicating existence
     */
    public async existsRaw(key: string): Promise<boolean> {
        try {
            return this._exists(key);
        } catch (error) {
            console.error(`Error checking existence: ${error}`);
            throw error;
        }
    }

    /**
     * Read data from storage
     *
     * @param key The key to read the data from
     * @returns A Promise resolving to the stored data or null if not found
     */
    public async read<T>(key: any): Promise<T | null> {
        try {
            const keyString = this.generateKey(key);
            return this._read<T>(keyString);
        } catch (error) {
            console.error(`Error reading data: ${error}`);
            throw error;
        }
    }
    protected abstract _read<T>(key: string): Promise<T | null>;

    /**
     * Read data from storage using raw string key
     *
     * @param key The string key to read the data from
     * @returns A Promise resolving to the stored data or null if not found
     */
    public async readRaw<T>(key: string): Promise<T | null> {
        try {
            return this._read<T>(key);
        } catch (error) {
            console.error(`Error reading data: ${error}`);
            throw error;
        }
    }

    /**
     * Save data to storage
     *
     * @param key The key to save the data under
     * @param data The data to save
     * @returns A Promise resolving when data has been saved
     */
    public async save<T>(key: any, data: T): Promise<void> {
        try {
            const keyString = this.generateKey(key);
            return this._save<T>(keyString, data);
        } catch (error) {
            console.error(`Error saving data: ${error}`);
            throw error;
        }
    }
    protected abstract _save<T>(key: string, data: T): Promise<void>;

    /**
     * Save data to storage using raw string key
     *
     * @param key The string key to save the data under
     * @param data The data to save
     * @returns A Promise resolving when data has been saved
     */
    public async saveRaw<T>(key: string, data: T): Promise<void> {
        try {
            return this._save<T>(key, data);
        } catch (error) {
            console.error(`Error saving data: ${error}`);
            throw error;
        }
    }
}
