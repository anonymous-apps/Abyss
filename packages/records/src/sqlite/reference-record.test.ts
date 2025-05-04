import { describe, expect, test } from 'vitest';
import { wait } from '../utils/wait';
import { ReferencedSqliteRecord } from './reference-record';
import { ReferencedSqliteTable } from './reference-table';
import { buildCleanDB } from './sqlite-client.test';
import { BaseSqliteRecord, SqliteTables } from './sqlite.type';

interface DebugType extends BaseSqliteRecord {
    name: string;
}

const createDebugTable = `
    CREATE TABLE IF NOT EXISTS Debug (
        id TEXT PRIMARY KEY,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL,
        name TEXT NOT NULL
    )
`;

async function createDbgDb() {
    await wait();
    const client = await buildCleanDB({ setupCommand: createDebugTable, skipMigrations: true });
    await wait();
    const table = new ReferencedSqliteTable<DebugType>('debug' as keyof SqliteTables, 'test', client);
    await client.overrideTable('debug' as keyof SqliteTables, table);
    return table;
}

async function createRecord() {
    const table = await createDbgDb();
    const record = await table.create({ id: 'test', name: 'test' });
    return new ReferencedSqliteRecord<DebugType>('debug' as keyof SqliteTables, record.id, table.client);
}

describe('ReferencedRecord::RefTable', () => {
    test('Happy: Get reference to table', async () => {
        const refRecord = await createRecord();
        const table = refRecord.ref_table();
        expect(table.tableId).toBe('debug');
    });
});

describe('ReferencedRecord::Get', () => {
    test('Happy: Get existing record', async () => {
        const refRecord = await createRecord();
        const result = await refRecord.get();
        expect(result).toMatchObject({ id: 'test', name: 'test' });
    });
});

describe('ReferencedRecord::Delete', () => {
    test('Happy: Delete existing record', async () => {
        const refRecord = await createRecord();
        await refRecord.delete();
        expect(await refRecord.exists()).toBe(false);
    });
});

describe('ReferencedRecord::Exists', () => {
    test('Happy: Check existing record', async () => {
        const refRecord = await createRecord();
        expect(await refRecord.exists()).toBe(true);
    });

    test('Happy: Check non-existent record', async () => {
        const table = await createDbgDb();
        const refRecord = new ReferencedSqliteRecord<DebugType>('debug' as keyof SqliteTables, 'non-existent', table.client);
        expect(await refRecord.exists()).toBe(false);
    });
});

describe('ReferencedRecord::Update', () => {
    test('Happy: Update existing record', async () => {
        const refRecord = await createRecord();
        await wait();
        await refRecord.update({ name: 'updated' });
        const updated = await refRecord.get();
        expect(updated.name).toEqual('updated');
        expect(updated.updatedAt).toBeGreaterThan(updated.createdAt);
    });
});

describe('ReferencedRecord::Clone', () => {
    test('Happy: Clone existing record', async () => {
        const refRecord = await createRecord();
        const cloned = await refRecord.clone();
        expect(cloned.id).not.toBe('test');
        const clonedRecord = await cloned.get();
        expect(clonedRecord.name).toBe('test');
        expect(await refRecord.ref_table().count()).toBe(2);
    });
});
