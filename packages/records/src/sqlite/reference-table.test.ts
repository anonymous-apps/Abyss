import { describe, expect, test } from 'vitest';
import { ReferencedSqliteTable } from './reference-table';
import { buildCleanDB } from './sqlite-client.test';
import { SqliteTables } from './sqlite.type';

type DebugRecord = {
    id: string;
    createdAt: number;
    updatedAt: number;
    jsonData?: Record<string, any>;
};

const createDebugTable = `
    CREATE TABLE IF NOT EXISTS Debug (
        id TEXT PRIMARY KEY,
        jsonData TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
    )
`;

async function createDbgDb() {
    const client = await buildCleanDB({ setupCommand: createDebugTable, skipMigrations: true });
    const table = new ReferencedSqliteTable<DebugRecord>('debug' as keyof SqliteTables, 'test', client);
    return table;
}

describe('ReferencedTable::List', () => {
    test('Happy: List empty table', async () => {
        const table = await createDbgDb();
        expect(await table.list()).toEqual([]);
    });
    test('Happy: List table with one record', async () => {
        const table = await createDbgDb();
        await table.create({ id: 'test' });
        expect(await table.list()).toMatchObject([{ id: 'test' }]);
    });
    test('Happy: List table with multiple records', async () => {
        const table = await createDbgDb();
        await table.create({ id: 'test' });
        await table.create({ id: 'test2' });
        expect(await table.list()).toMatchObject([{ id: 'test' }, { id: 'test2' }]);
    });
    test('Happy: List table with serialized json data', async () => {
        const table = await createDbgDb();
        await table.create({ id: 'test', jsonData: { test: 'test' } });
        expect(await table.list()).toMatchObject([{ id: 'test', jsonData: { test: 'test' } }]);
    });
});

describe('ReferencedTable::Count', () => {
    test('Happy: Count empty table', async () => {
        const table = await createDbgDb();
        expect(await table.count()).toEqual(0);
    });
    test('Happy: Count table with one record', async () => {
        const table = await createDbgDb();
        await table.create({ id: 'test' });
        expect(await table.count()).toEqual(1);
    });
    test('Happy: Count table with multiple records', async () => {
        const table = await createDbgDb();
        await table.create({ id: 'test' });
        await table.create({ id: 'test2' });
        expect(await table.count()).toEqual(2);
    });
});

describe('ReferencedTable::Create', () => {
    test('Happy: Create a new record', async () => {
        const table = await createDbgDb();
        expect(await table.create({ id: 'test' })).toMatchObject({ id: 'test' });
    });
    test('Happy: Create multiple new records', async () => {
        const table = await createDbgDb();
        expect(await table.createMany([{ id: 'test' }, { id: 'test2' }])).toMatchObject([{ id: 'test' }, { id: 'test2' }]);
    });
    test('Sad: Create a new record with an existing id', async () => {
        const table = await createDbgDb();
        await table.create({ id: 'test' });
        await expect(table.create({ id: 'test' })).rejects.toThrow();
    });
});

describe('ReferencedTable::PurgeAll', () => {
    test('Happy: Purge all records', async () => {
        const table = await createDbgDb();
        await table.create({ id: 'test' });
        await table.create({ id: 'test2' });
        await table.purgeAll();
        expect(await table.list()).toEqual([]);
    });
});

describe('ReferencedTable::Get', () => {
    test('Happy: Get a record', async () => {
        const table = await createDbgDb();
        await table.create({ id: 'test', jsonData: { test: 'test' } });
        expect(await table.get('test')).toMatchObject({ id: 'test', jsonData: { test: 'test' } });
    });
});
