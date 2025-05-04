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

    async list(limit: number = 9999): Promise<BaseSqliteRecord[]> {
        const raw = await this.client.execute(`SELECT * FROM ${this.tableId} ORDER BY createdAt LIMIT ?`, [limit]);
        return raw as BaseSqliteRecord[];
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
        const raw = await this.client.execute(
            `INSERT INTO ${this.tableId} (${Object.keys(data).join(', ')}) VALUES (${Object.values(data)
                .map(() => '?')
                .join(', ')}) RETURNING *`,
            [...Object.values(data)]
        );
        this.client.events.notifyTableChanged(this);
        return (raw as IRecordType[])[0];
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

        const columns = Object.keys(data[0]).join(', ');
        const placeholders = data
            .map(
                () =>
                    `(${Object.keys(data[0])
                        .map(() => '?')
                        .join(', ')})`
            )
            .join(', ');

        const raw = await this.client.execute(
            `INSERT INTO ${this.tableId} (${columns}) VALUES ${placeholders} RETURNING *`,
            data.flatMap(record => Object.values(record))
        );

        this.client.events.notifyTableChanged(this);
        return raw as IRecordType[];
    }

    async get(id: string): Promise<IRecordType> {
        const raw = await this.client.execute(`SELECT * FROM ${this.tableId} WHERE id = ?`, [id]);
        return (raw as IRecordType[])[0];
    }

    subscribeRecord(id: string, callback: (record: IRecordType) => void): () => void {
        return this.client.events.subscribeRecord(this.tableId, id, callback as (record: BaseSqliteRecord) => void);
    }

    subscribeTable(callback: (table: ReferencedSqliteTable<IRecordType>) => void): () => void {
        return this.client.events.subscribeTable(this.tableId, callback as (table: ReferencedSqliteTable) => void);
    }
}
