import { ReferencedSqliteTable } from './reference-table';
import type { SQliteClient } from './sqlite-client';
import type { BaseSqliteRecord, SqliteTables } from './sqlite.type';

export class ReferencedSqliteRecord<IRecordType extends BaseSqliteRecord = BaseSqliteRecord> {
    public readonly tableId: keyof SqliteTables;
    public readonly id: string;
    public readonly client: SQliteClient;

    constructor(tableId: keyof SqliteTables, recordId: string, client: SQliteClient) {
        this.tableId = tableId;
        this.id = recordId;
        this.client = client;
    }

    ref_table() {
        return this.client.tables[this.tableId];
    }

    async get(): Promise<IRecordType> {
        const raw = await this.client.execute(`SELECT * FROM ${this.tableId} WHERE id = ?`, [this.id]);
        return ReferencedSqliteTable.deserialize<IRecordType>((raw as IRecordType[])[0]);
    }

    async delete() {
        await this.client.execute(`DELETE FROM ${this.tableId} WHERE id = ?`, [this.id]);
        this.client.events.notifyRecordChanged(this);
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
        this.client.events.notifyRecordChanged(this);
    }

    async clone(): Promise<ReferencedSqliteRecord<IRecordType>> {
        const record = await this.get();
        const { id, createdAt, updatedAt, ...rest } = record;
        const newRecord = await this.ref_table().create(rest as any);
        return new ReferencedSqliteRecord(this.tableId, newRecord.id, this.client);
    }
}
