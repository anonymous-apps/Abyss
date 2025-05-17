import { randomId } from '../utils/ids';
import { ReferencedSqliteRecord } from './reference-record';
import type { ReferencedSqliteTable } from './reference-table';
import type { BaseSqliteRecord } from './sqlite.type';
import type { SQliteClient } from './sqlite-client';

type DatabaseSubscriber = () => void;
type TableSubscriber = (table: ReferencedSqliteTable) => void;
type RecordSubscriber = (record: BaseSqliteRecord) => void;

export class DatabaseSubscriptionLayer {
    private client: SQliteClient;

    private subscribersToDatabase: Record<string, DatabaseSubscriber> = {};
    private subscribersToTable: Record<string, Record<string, TableSubscriber>> = {};
    private subscribersToRecords: Record<string, Record<string, Record<string, RecordSubscriber>>> = {};

    constructor(client: SQliteClient) {
        this.client = client;
    }

    // Utils

    public subscribeDatabase(callback: DatabaseSubscriber): () => void {
        const id = randomId();
        this.subscribersToDatabase[id] = callback;
        return () => this.removeDatabaseSubscriber(id);
    }

    private removeDatabaseSubscriber(id: string): void {
        if (this.subscribersToDatabase[id]) {
            delete this.subscribersToDatabase[id];
        }
    }

    public subscribeTable(table: string, callback: TableSubscriber): () => void {
        if (!this.subscribersToTable[table]) {
            this.subscribersToTable[table] = {};
        }

        const id = randomId();
        this.subscribersToTable[table][id] = callback;

        return () => this.removeTableSubscriber(table, id);
    }

    private removeTableSubscriber(table: string, id: string): void {
        if (this.subscribersToTable[table]?.[id]) {
            delete this.subscribersToTable[table][id];

            // Clean up empty objects
            if (Object.keys(this.subscribersToTable[table]).length === 0) {
                delete this.subscribersToTable[table];
            }
        }
    }

    public async subscribeRecord(client: SQliteClient, table: string, recordId: string, callback: RecordSubscriber): Promise<() => void> {
        if (!this.subscribersToRecords[table]) {
            this.subscribersToRecords[table] = {};
        }

        if (!this.subscribersToRecords[table][recordId]) {
            this.subscribersToRecords[table][recordId] = {};
        }

        const id = randomId();
        this.subscribersToRecords[table][recordId][id] = callback;

        const record = await client.tables[table as keyof typeof client.tables].get(recordId);
        callback(record);

        return () => this.removeRecordSubscriber(table, recordId, id);
    }

    private removeRecordSubscriber(table: string, recordId: string, id: string): void {
        if (this.subscribersToRecords[table]?.[recordId]?.[id]) {
            delete this.subscribersToRecords[table][recordId][id];

            // Clean up empty objects
            if (Object.keys(this.subscribersToRecords[table][recordId]).length === 0) {
                delete this.subscribersToRecords[table][recordId];
            }

            if (Object.keys(this.subscribersToRecords[table]).length === 0) {
                delete this.subscribersToRecords[table];
            }
        }
    }

    // Notify

    private async triggerDatabaseSubscribers() {
        const subscribers = Object.values(this.subscribersToDatabase);
        for (const callback of subscribers) {
            await callback();
        }
    }

    private async triggerTableSubscribers(table: ReferencedSqliteTable) {
        const subscribers = Object.values(this.subscribersToTable[table.tableId] || {});
        for (const callback of subscribers) {
            await callback(table);
        }
    }

    private async triggerAllTableSubscribers() {
        const tableIds = Object.keys(this.subscribersToTable);
        for (const tableId of tableIds) {
            const table = this.client.tables[tableId as keyof typeof this.client.tables];
            await this.triggerTableSubscribers(table);
        }
    }

    private async triggerRecordSubscribers(record: ReferencedSqliteRecord) {
        const value = await record.get();
        if (this.subscribersToRecords[record.tableId] && this.subscribersToRecords[record.tableId][record.id]) {
            const subscribers = Object.values(this.subscribersToRecords[record.tableId][record.id]);
            for (const callback of subscribers) {
                await callback(value);
            }
        }
    }

    private async triggerAllRecordsSubscriberInsideTable(table: ReferencedSqliteTable) {
        const recordIds = Object.keys(this.subscribersToRecords[table.tableId] || {});
        for (const recordId of recordIds) {
            const record = new ReferencedSqliteRecord(table.tableId, recordId, this.client);
            await this.triggerRecordSubscribers(record);
        }
    }

    private async triggerAllRecordSubscribersInAllTables() {
        const tableIds = Object.keys(this.subscribersToRecords);
        for (const tableId of tableIds) {
            await this.triggerAllRecordsSubscriberInsideTable(this.client.tables[tableId as keyof typeof this.client.tables]);
        }
    }

    // DB changed at top level, notify db subscribers
    public async notifyDatabaseChanged() {
        await this.triggerDatabaseSubscribers();
        await this.triggerAllTableSubscribers();
        await this.triggerAllRecordSubscribersInAllTables();
    }

    // Table change, notify all records in table, table subscribers, and database subscribers
    public async notifyTableChanged(table: ReferencedSqliteTable) {
        await this.triggerDatabaseSubscribers();
        await this.triggerTableSubscribers(table);
        await this.triggerAllRecordsSubscriberInsideTable(table);
    }

    // Record change, notify record subscribers, table subscribers, and database subscribers
    public async notifyRecordChanged(record: ReferencedSqliteRecord) {
        await this.triggerDatabaseSubscribers();
        await this.triggerTableSubscribers(record.table);
        await this.triggerRecordSubscribers(record);
    }
}
