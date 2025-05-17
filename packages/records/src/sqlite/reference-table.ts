import { generateId } from '../utils/ids';
import type { BaseSqliteRecord, NewRecord, SqliteTables } from './sqlite.type';
import type { SQliteClient } from './sqlite-client';

export class ReferencedSqliteTable<IRecordType extends BaseSqliteRecord = BaseSqliteRecord> {
    public readonly tableId: keyof SqliteTables;
    public readonly client: SQliteClient;
    public readonly description: string;

    constructor(tableId: keyof SqliteTables, description: string, client: SQliteClient) {
        this.tableId = tableId;
        this.client = client;
        this.description = description;
    }

    public static serialize<T extends BaseSqliteRecord>(record: T): Record<string, unknown> {
        const serialized: Record<string, unknown> = { ...record } as Record<string, unknown>;
        for (const key in serialized) {
            if (key.endsWith('Data') && serialized[key] !== null && typeof serialized[key] === 'object') {
                serialized[key] = JSON.stringify(serialized[key]);
            }
        }
        return serialized;
    }

    public static deserialize<T extends BaseSqliteRecord>(record: Record<string, unknown>): T {
        const deserialized = { ...record } as Record<string, unknown>;
        for (const key in deserialized) {
            if (key.endsWith('Data') && typeof deserialized[key] === 'string') {
                try {
                    deserialized[key] = JSON.parse(deserialized[key] as string);
                } catch (error) {
                    console.error(`Error parsing JSON for key ${key}:`, error);
                }
            }
        }
        return deserialized as T;
    }

    async list(limit = 9999) {
        const raw = await this.client.execute(`SELECT * FROM ${this.tableId} ORDER BY createdAt DESC LIMIT ?`, [limit]);
        const results = raw as Record<string, unknown>[];
        const deserialized = results.map(r => ReferencedSqliteTable.deserialize(r));
        return deserialized as IRecordType[];
    }

    async count(): Promise<number> {
        const raw = await this.client.execute(`SELECT COUNT(*) as count FROM ${this.tableId}`);
        return (raw as { count: number }[])[0].count;
    }

    async purgeAll(): Promise<void> {
        await this.client.execute(`DELETE FROM ${this.tableId}`);
        this.client.events.notifyTableChanged(this);
    }

    async create(record: NewRecord<IRecordType>): Promise<IRecordType> {
        const data = {
            id: generateId(this.tableId),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            ...record,
        };
        const serialized = ReferencedSqliteTable.serialize(data as IRecordType);
        const raw = await this.client.execute(
            `INSERT OR REPLACE INTO ${this.tableId} (${Object.keys(serialized).join(', ')}) VALUES (${Object.values(serialized)
                .map(() => '?')
                .join(', ')}) RETURNING *`,
            [...Object.values(serialized)]
        );
        this.client.events.notifyTableChanged(this);
        return ReferencedSqliteTable.deserialize<IRecordType>((raw as Record<string, unknown>[])[0]);
    }

    async createMany(records: NewRecord<IRecordType>[]): Promise<IRecordType[]> {
        const data = records.map(r => ({
            id: generateId(this.tableId),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            ...r,
        }));

        if (data.length === 0) {
            return [];
        }

        const serializedRecords = data.map(r => ReferencedSqliteTable.serialize(r as unknown as IRecordType));
        const columns = Object.keys(serializedRecords[0]).join(', ');
        const placeholders = serializedRecords
            .map(
                () =>
                    `(${Object.keys(serializedRecords[0])
                        .map(() => '?')
                        .join(', ')})`
            )
            .join(', ');

        const raw = await this.client.execute(
            `INSERT OR REPLACE INTO ${this.tableId} (${columns}) VALUES ${placeholders} RETURNING *`,
            serializedRecords.flatMap(sr => Object.values(sr))
        );

        this.client.events.notifyTableChanged(this);
        const results = raw as Record<string, unknown>[];
        return results.map(r => ReferencedSqliteTable.deserialize<IRecordType>(r));
    }

    async get(id: string): Promise<IRecordType> {
        const raw = await this.client.execute(`SELECT * FROM ${this.tableId} WHERE id = ?`, [id]);
        const results = raw as Record<string, unknown>[];
        if (results && results.length > 0) {
            return ReferencedSqliteTable.deserialize<IRecordType>(results[0]);
        }
        throw new Error(`Record with id ${id} not found in table ${this.tableId}`);
    }

    async exists(id: string): Promise<boolean> {
        const raw = await this.client.execute(`SELECT COUNT(*) as count FROM ${this.tableId} WHERE id = ?`, [id]);
        return (raw as { count: number }[])[0].count > 0;
    }
}
