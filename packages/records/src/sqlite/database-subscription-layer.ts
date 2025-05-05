import { randomId } from '../utils/ids';
import { ReferencedSqliteRecord } from './reference-record';
import { ReferencedSqliteTable } from './reference-table';
import { SQliteClient } from './sqlite-client';
import { BaseSqliteRecord } from './sqlite.type';

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
        if (this.subscribersToTable[table] && this.subscribersToTable[table][id]) {
            delete this.subscribersToTable[table][id];

            // Clean up empty objects
            if (Object.keys(this.subscribersToTable[table]).length === 0) {
                delete this.subscribersToTable[table];
            }
        }
    }

    public subscribeRecord(client: SQliteClient, table: string, recordId: string, callback: RecordSubscriber): () => void {
        if (!this.subscribersToRecords[table]) {
            this.subscribersToRecords[table] = {};
        }

        if (!this.subscribersToRecords[table][recordId]) {
            this.subscribersToRecords[table][recordId] = {};
        }

        const id = randomId();
        this.subscribersToRecords[table][recordId][id] = callback;

        client.tables[table as keyof typeof client.tables].get(recordId).then(record => {
            callback(record);
        });

        return () => this.removeRecordSubscriber(table, recordId, id);
    }

    private removeRecordSubscriber(table: string, recordId: string, id: string): void {
        if (
            this.subscribersToRecords[table] &&
            this.subscribersToRecords[table][recordId] &&
            this.subscribersToRecords[table][recordId][id]
        ) {
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
        Object.values(this.subscribersToDatabase).forEach(callback => callback());
    }

    private async triggerTableSubscribers(table: ReferencedSqliteTable) {
        Object.values(this.subscribersToTable[table.tableId] || {}).forEach(callback => callback(table));
    }

    private async triggerAllTableSubscribers() {
        Object.keys(this.subscribersToTable).forEach(tableId => {
            const table = this.client.tables[tableId as keyof typeof this.client.tables];
            this.triggerTableSubscribers(table);
        });
    }

    private async triggerRecordSubscribers(record: ReferencedSqliteRecord) {
        const value = await record.get();
        if (this.subscribersToRecords[record.tableId] && this.subscribersToRecords[record.tableId][record.id]) {
            Object.values(this.subscribersToRecords[record.tableId][record.id]).forEach(callback => callback(value));
        }
    }

    private async triggerAllRecordsSubscriberInsideTable(table: ReferencedSqliteTable) {
        Object.keys(this.subscribersToRecords[table.tableId] || {}).forEach(recordId => {
            const record = new ReferencedSqliteRecord(table.tableId, recordId, this.client);
            this.triggerRecordSubscribers(record);
        });
    }

    private async triggerAllRecordSubscribersInAllTables() {
        Object.keys(this.subscribersToRecords).forEach(tableId => {
            this.triggerAllRecordsSubscriberInsideTable(this.client.tables[tableId as keyof typeof this.client.tables]);
        });
    }

    // DB changed at top level, update everything
    public notifyDatabaseChanged() {
        this.triggerDatabaseSubscribers();
        this.triggerAllTableSubscribers();
        this.triggerAllRecordSubscribersInAllTables();
    }

    // Table change, notify all records in table, table subscribers, and database subscribers
    public notifyTableChanged(table: ReferencedSqliteTable) {
        this.triggerDatabaseSubscribers();
        this.triggerTableSubscribers(table);
        this.triggerAllRecordsSubscriberInsideTable(table);
    }

    // Record change, notify record subscribers, table subscribers, and database subscribers
    public notifyRecordChanged(record: ReferencedSqliteRecord) {
        this.triggerDatabaseSubscribers();
        this.triggerTableSubscribers(record.ref_table());
        this.triggerRecordSubscribers(record);
    }
}
