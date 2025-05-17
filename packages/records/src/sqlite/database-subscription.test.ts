import { describe, expect, test } from 'vitest';
import { EventValidator } from './events-recorder.test';
import { ReferencedSqliteRecord } from './reference-record';
import { ReferencedSqliteTable } from './reference-table';
import type { BaseSqliteRecord, SqliteTables } from './sqlite.type';
import { buildCleanDB } from './sqlite-client.mock';

interface TestRecord extends BaseSqliteRecord {
    name: string;
    value?: number;
}

const createTestTableCommand = `
    CREATE TABLE IF NOT EXISTS test_table_1 (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        name TEXT NOT NULL,
        value INTEGER
    );
    CREATE TABLE IF NOT EXISTS test_table_2 (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        name TEXT NOT NULL,
        value INTEGER
    );
`;

async function createDbgDbWithSubscription() {
    const client = await buildCleanDB({ setupCommand: createTestTableCommand });
    const table1 = new ReferencedSqliteTable<TestRecord>('test_table_1' as keyof SqliteTables, 'test_table_1', client);
    await client.overrideTable('test_table_1' as keyof SqliteTables, table1);
    const table2 = new ReferencedSqliteTable<TestRecord>('test_table_2' as keyof SqliteTables, 'test_table_2', client);
    await client.overrideTable('test_table_2' as keyof SqliteTables, table2);
    const subscriptionLayer = client.events;
    const events = new EventValidator();
    return { client, table: table1, otherTable: table2, subscriptionLayer, events };
}

describe('Database Level Subscriptions', () => {
    test('when subscribed to database, recieve no initial notification', async () => {
        const { subscriptionLayer, events } = await createDbgDbWithSubscription();
        subscriptionLayer.subscribeDatabase(events.consumeDatabaseEvent);
        expect(events.events).toEqual([]);
    });

    test('when subscribed to database, recieve notification when record changes', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record = await table.create({ name: 'test' });
        const recordRef = new ReferencedSqliteRecord<TestRecord>(table.tableId, record.id, table.client);
        subscriptionLayer.subscribeDatabase(events.consumeDatabaseEvent);
        await subscriptionLayer.notifyRecordChanged(recordRef);
        expect(events.events).toEqual(['database_event']);
    });

    test('when subscribed to database, recieve notification when table changes', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        subscriptionLayer.subscribeDatabase(events.consumeDatabaseEvent);
        await subscriptionLayer.notifyTableChanged(table);
        expect(events.events).toEqual(['database_event']);
    });

    test('when subscribed to database, recieve notification when db changes', async () => {
        const { subscriptionLayer, events } = await createDbgDbWithSubscription();
        subscriptionLayer.subscribeDatabase(events.consumeDatabaseEvent);
        await subscriptionLayer.notifyDatabaseChanged();
        expect(events.events).toEqual(['database_event']);
    });

    test('when subscribed to database, dont recieve notification after unsubscribe', async () => {
        const { subscriptionLayer, events } = await createDbgDbWithSubscription();
        const unsubscribe = subscriptionLayer.subscribeDatabase(events.consumeDatabaseEvent);
        unsubscribe();
        await subscriptionLayer.notifyDatabaseChanged();
        expect(events.events).toEqual([]);
    });

    test('when subscribed to database, recieve multiple notifications when multiple records change', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record1 = await table.create({ name: 'test1' });
        const record2 = await table.create({ name: 'test2' });
        const recordRef1 = new ReferencedSqliteRecord<TestRecord>(table.tableId, record1.id, table.client);
        const recordRef2 = new ReferencedSqliteRecord<TestRecord>(table.tableId, record2.id, table.client);
        subscriptionLayer.subscribeDatabase(events.consumeDatabaseEvent);
        await subscriptionLayer.notifyRecordChanged(recordRef1);
        await subscriptionLayer.notifyRecordChanged(recordRef2);
        expect(events.events).toEqual(['database_event', 'database_event']);
    });
});

describe('Table Level Subscriptions', () => {
    test('when subscribed to table, recieve no initial notification', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        subscriptionLayer.subscribeTable(table.tableId, events.consumeTableEvent);
        expect(events.events).toEqual([]);
    });

    test('when subscribed to table, recieve notification when record in table changes', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record = await table.create({ name: 'test' });
        const recordRef = new ReferencedSqliteRecord<TestRecord>(table.tableId, record.id, table.client);
        subscriptionLayer.subscribeTable(table.tableId, events.consumeTableEvent);
        await subscriptionLayer.notifyRecordChanged(recordRef);
        expect(events.events).toEqual(['table_event']);
    });

    test('when subscribed to table, recieve notification when table changes', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        subscriptionLayer.subscribeTable(table.tableId, events.consumeTableEvent);
        await subscriptionLayer.notifyTableChanged(table);
        expect(events.events).toEqual(['table_event']);
    });

    test('when subscribed to table, recieve no notification when other table changes', async () => {
        const { table, otherTable, subscriptionLayer, events } = await createDbgDbWithSubscription();
        subscriptionLayer.subscribeTable(table.tableId, events.consumeTableEvent);
        await subscriptionLayer.notifyTableChanged(otherTable);
        expect(events.events).toEqual([]);
    });

    test('when subscribed to table, recieve no notification when record not in table changes', async () => {
        const { table, otherTable, subscriptionLayer, events } = await createDbgDbWithSubscription();
        subscriptionLayer.subscribeTable(otherTable.tableId, events.consumeTableEvent);
        await table.create({ name: 'test' });
        expect(events.events).toEqual([]);
    });

    test('when subscribed to table, recieve notification when db changes', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        subscriptionLayer.subscribeTable(table.tableId, events.consumeTableEvent);
        await subscriptionLayer.notifyDatabaseChanged();
        expect(events.events).toEqual(['table_event']);
    });

    test('when subscribed to table, dont recieve notification after unsubscribe', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const unsubscribe = subscriptionLayer.subscribeTable(table.tableId, events.consumeTableEvent);
        unsubscribe();
        await subscriptionLayer.notifyTableChanged(table);
        expect(events.events).toEqual([]);
    });

    test('when subscribed to table, recieve multiple notifications when multiple records change', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record1 = await table.create({ name: 'test1' });
        const record2 = await table.create({ name: 'test2' });
        const recordRef1 = new ReferencedSqliteRecord<TestRecord>(table.tableId, record1.id, table.client);
        const recordRef2 = new ReferencedSqliteRecord<TestRecord>(table.tableId, record2.id, table.client);
        subscriptionLayer.subscribeTable(table.tableId, events.consumeTableEvent);
        await subscriptionLayer.notifyRecordChanged(recordRef1);
        await subscriptionLayer.notifyRecordChanged(recordRef2);
        expect(events.events).toEqual(['table_event', 'table_event']);
    });
});

describe('Record Level Subscriptions', () => {
    test('when subscribed to record, recieve an initial notification', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record = await table.create({ name: 'test' });
        await subscriptionLayer.subscribeRecord(table.client, table.tableId, record.id, events.consumeRecordEvent);
        expect(events.events).toEqual(['record_event']);
    });

    test('when subscribed to record, recieve notification when record changes', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record = await table.create({ name: 'test' });
        const recordRef = new ReferencedSqliteRecord<TestRecord>(table.tableId, record.id, table.client);
        subscriptionLayer.subscribeRecord(table.client, table.tableId, record.id, events.consumeRecordEvent);
        await subscriptionLayer.notifyRecordChanged(recordRef);
        expect(events.events).toEqual(['record_event', 'record_event']);
    });

    test('when subscribed to record, recieve notification when table changes', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record = await table.create({ name: 'test' });
        subscriptionLayer.subscribeRecord(table.client, table.tableId, record.id, events.consumeRecordEvent);
        await subscriptionLayer.notifyTableChanged(table);
        expect(events.events).toEqual(['record_event', 'record_event']);
    });

    test('when subscribed to record, recieve notification when db changes', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record = await table.create({ name: 'test' });
        subscriptionLayer.subscribeRecord(table.client, table.tableId, record.id, events.consumeRecordEvent);
        await subscriptionLayer.notifyDatabaseChanged();
        expect(events.events).toEqual(['record_event', 'record_event']);
    });

    test('when subscribed to record, dont recieve notification after unsubscribe', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record = await table.create({ name: 'test' });
        const recordRef = new ReferencedSqliteRecord<TestRecord>(table.tableId, record.id, table.client);
        const unsubscribe = await subscriptionLayer.subscribeRecord(table.client, table.tableId, record.id, events.consumeRecordEvent);
        unsubscribe();
        await subscriptionLayer.notifyRecordChanged(recordRef);
        expect(events.events).toEqual(['record_event']);
    });
    test('when subscribed to record, recieve multiple notifications when multiple records change', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record1 = await table.create({ name: 'test1' });
        const record2 = await table.create({ name: 'test2' });
        const recordRef1 = new ReferencedSqliteRecord<TestRecord>(table.tableId, record1.id, table.client);
        const recordRef2 = new ReferencedSqliteRecord<TestRecord>(table.tableId, record2.id, table.client);
        await subscriptionLayer.subscribeRecord(table.client, table.tableId, record1.id, events.consumeRecordEvent);
        await subscriptionLayer.subscribeRecord(table.client, table.tableId, record2.id, events.consumeRecordEvent);
        await subscriptionLayer.notifyRecordChanged(recordRef1);
        await subscriptionLayer.notifyRecordChanged(recordRef2);
        expect(events.events).toEqual(['record_event', 'record_event', 'record_event', 'record_event']);
    });

    test('when subscribed to record, recieve no notification when other record changes', async () => {
        const { table, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record1 = await table.create({ name: 'test1' });
        const record2 = await table.create({ name: 'test2' });
        const recordRef2 = new ReferencedSqliteRecord<TestRecord>(table.tableId, record2.id, table.client);
        await subscriptionLayer.subscribeRecord(table.client, table.tableId, record1.id, events.consumeRecordEvent);
        await subscriptionLayer.notifyRecordChanged(recordRef2);
        expect(events.events).toEqual(['record_event']);
    });

    test('when subscribed to record, recieve no notification when other table changes', async () => {
        const { table, otherTable, subscriptionLayer, events } = await createDbgDbWithSubscription();
        const record = await table.create({ name: 'test' });
        await subscriptionLayer.subscribeRecord(table.client, table.tableId, record.id, events.consumeRecordEvent);
        await subscriptionLayer.notifyTableChanged(otherTable);
        expect(events.events).toEqual(['record_event']);
    });
});
