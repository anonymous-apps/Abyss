import { generateId } from '../utils/ids';
import { SQliteClient } from './sqlite-client';
import { BaseSqliteRecord, NewRecord, SqliteTables } from './sqlite.type';

export class ReferencedSqliteTable<IRecordType extends BaseSqliteRecord = BaseSqliteRecord> {
    public readonly tableId: keyof SqliteTables;
    public readonly client: SQliteClient;
    public readonly description: string;

    constructor(tableId: keyof SqliteTables, description: string, client: SQliteClient) {
        this.tableId = tableId;
        this.client = client;
        this.description = description;
    }

    public static serialize<T extends BaseSqliteRecord>(record: T): Record<string, any> {
        const serialized: Record<string, any> = { ...record };
        for (const key in serialized) {
            if (key.endsWith('Data') && serialized[key] !== null && typeof serialized[key] === 'object') {
                serialized[key] = JSON.stringify(serialized[key]);
            }
        }
        return serialized;
    }

    public static deserialize<T extends BaseSqliteRecord>(record: Record<string, any>): T {
        const deserialized = { ...record };
        for (const key in deserialized) {
            if (key.endsWith('Data') && typeof deserialized[key] === 'string') {
                deserialized[key] = JSON.parse(deserialized[key]);
            }
        }
        return deserialized as T;
    }

    async list(limit: number = 9999): Promise<BaseSqliteRecord[]> {
        const raw = await this.client.execute(`SELECT * FROM ${this.tableId} ORDER BY createdAt LIMIT ?`, [limit]);
        const results = raw as Record<string, any>[];
        const deserialized = results.map(r => ReferencedSqliteTable.deserialize(r));
        return deserialized;
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
            `INSERT INTO ${this.tableId} (${Object.keys(serialized).join(', ')}) VALUES (${Object.values(serialized)
                .map(() => '?')
                .join(', ')}) RETURNING *`,
            [...Object.values(serialized)]
        );
        this.client.events.notifyTableChanged(this);
        return ReferencedSqliteTable.deserialize<IRecordType>((raw as IRecordType[])[0]);
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

        const serialized = data.map(r => ReferencedSqliteTable.serialize(r as IRecordType));
        const columns = Object.keys(serialized[0]).join(', ');
        const placeholders = serialized
            .map(
                () =>
                    `(${Object.keys(serialized[0])
                        .map(() => '?')
                        .join(', ')})`
            )
            .join(', ');

        const raw = await this.client.execute(
            `INSERT INTO ${this.tableId} (${columns}) VALUES ${placeholders} RETURNING *`,
            data.flatMap(record => Object.values(ReferencedSqliteTable.serialize(record as IRecordType)))
        );

        this.client.events.notifyTableChanged(this);
        const results = raw as Record<string, any>[];
        return results.map(r => ReferencedSqliteTable.deserialize<IRecordType>(r));
    }

    async get(id: string): Promise<IRecordType> {
        const raw = await this.client.execute(`SELECT * FROM ${this.tableId} WHERE id = ?`, [id]);
        const results = raw as Record<string, any>[];
        return ReferencedSqliteTable.deserialize<IRecordType>(results[0]);
    }

    subscribeRecord(id: string, callback: (record: IRecordType) => void): () => void {
        return this.client.events.subscribeRecord(this.tableId, id, callback as (record: BaseSqliteRecord) => void);
    }

    subscribeTable(callback: (table: ReferencedSqliteTable<IRecordType>) => void): () => void {
        return this.client.events.subscribeTable(this.tableId, callback as (table: ReferencedSqliteTable) => void);
    }
}
