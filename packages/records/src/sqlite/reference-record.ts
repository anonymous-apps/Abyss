import { ReferencedSqliteTable } from './reference-table';
import { SQliteClient } from './sqlite-client';
import { BaseSqliteRecord, SqliteTables } from './sqlite.type';

export class ReferencedSqliteRecord<IRecordType extends BaseSqliteRecord = BaseSqliteRecord> {
    public readonly tableId: keyof SqliteTables;
    public readonly id: string;
    protected client: SQliteClient;

    constructor(tableId: keyof SqliteTables, recordId: string, client: SQliteClient) {
        this.tableId = tableId;
        this.id = recordId;
        this.client = client;
    }

    ref_table(): ReferencedSqliteTable {
        return this.client.tables[this.tableId];
    }

    async get(): Promise<IRecordType> {
        const raw = await this.client.execute(`SELECT * FROM ${this.tableId} WHERE id = ?`, [this.id]);
        return raw as IRecordType;
    }

    async delete() {
        await this.client.execute(`DELETE FROM ${this.tableId} WHERE id = ?`, [this.id]);
        this.client.events.notifyRecordChanged(this);
    }

    async exists() {
        const raw = await this.client.execute(`SELECT COUNT(*) FROM ${this.tableId} WHERE id = ?`, [this.id]);
        return (raw as { count: number }[])[0].count > 0;
    }

    async update(record: Partial<IRecordType>) {
        record.updatedAt = Date.now();
        await this.client.execute(
            `UPDATE ${this.tableId} SET ${Object.keys(record)
                .map(key => `${key} = ?`)
                .join(', ')} WHERE id = ?`,
            [...Object.values(record), this.id]
        );
        this.client.events.notifyRecordChanged(this);
    }
}
