import { ReferencedSqliteTable } from './reference-table';
import type { BaseSqliteRecord, SqliteTables } from './sqlite.type';
import type { SQliteClient } from './sqlite-client';

export class ReferencedSqliteRecord<
    IRecordType extends BaseSqliteRecord = BaseSqliteRecord,
    ITableType extends ReferencedSqliteTable<IRecordType> = ReferencedSqliteTable<IRecordType>,
> {
    public readonly tableId: keyof SqliteTables;
    public readonly id: string;
    public readonly client: SQliteClient;
    public readonly table: ITableType;
    public readonly tables: SqliteTables;

    constructor(tableId: keyof SqliteTables, recordId: string, client: SQliteClient) {
        this.tableId = tableId;
        this.id = recordId;
        this.client = client;
        this.table = client.tables[tableId] as unknown as ITableType;
        this.tables = client.tables;
    }

    async get(): Promise<IRecordType> {
        const raw = await this.client.execute(`SELECT * FROM ${this.tableId} WHERE id = ?`, [this.id]);
        return ReferencedSqliteTable.deserialize<IRecordType>((raw as Record<string, unknown>[])[0]);
    }

    async delete() {
        await this.client.execute(`DELETE FROM ${this.tableId} WHERE id = ?`, [this.id]);
        await this.client.events.notifyRecordChanged(this);
    }

    async exists() {
        const raw = await this.client.execute(`SELECT COUNT(*) as count FROM ${this.tableId} WHERE id = ?`, [this.id]);
        return (raw as { count: number }[])[0].count > 0;
    }

    async update(record: Partial<IRecordType>) {
        record.updatedAt = Date.now();
        const serialized = ReferencedSqliteTable.serialize(record as IRecordType);
        await this.client.execute(
            `UPDATE ${this.tableId} SET ${Object.keys(serialized)
                .map(key => `${key} = ?`)
                .join(', ')} WHERE id = ?`,
            [...Object.values(serialized), this.id]
        );
        await this.client.events.notifyRecordChanged(this);
    }

    async clone(): Promise<ReferencedSqliteRecord<IRecordType>> {
        const record = await this.get();
        // biome-ignore lint/correctness/noUnusedVariables: 'id', 'createdAt', and 'updatedAt' are intentionally destructured and unused to collect the 'rest' for cloning.
        const { id, createdAt, updatedAt, ...rest } = record;
        // Using 'as any' for the 'rest' parameter in the create call to address the persistent type error for now.
        // and 'create' expects a specific Omit<T, ...> which can lead to complex generic type mismatches.
        // 'rest' is structurally correct for creating a new record.
        // biome-ignore lint/suspicious/noExplicitAny: Creating a new record
        const newRecord = await this.table.create(rest as any);
        return new ReferencedSqliteRecord(this.tableId, newRecord.id, this.client);
    }

    subscribe(callback: (record: IRecordType) => void) {
        return this.client.events.subscribeRecord(this.client, this.tableId, this.id, callback as (record: BaseSqliteRecord) => void);
    }
}
