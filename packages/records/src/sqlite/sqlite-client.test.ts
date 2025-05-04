import { rmdirSync, unlinkSync } from 'fs';
import { describe, it } from 'vitest';
import { SQliteClient } from './sqlite-client';

export async function buildCleanDB({ setupCommand, skipMigrations = false }: { setupCommand?: string; skipMigrations?: boolean } = {}) {
    try {
        unlinkSync('./.test-artifacts/db.sqlite');
    } catch {}
    try {
        unlinkSync('./.test-artifacts/sidecar.json');
    } catch {}
    try {
        rmdirSync('./.test-artifacts');
    } catch {}
    const client = new SQliteClient('./.test-artifacts');
    await client.initialize();
    if (!skipMigrations) {
        await client.migrateAll();
    }
    if (setupCommand) {
        await client.execute(setupCommand);
    }
    return client;
}

describe('SQLiteClient', () => {
    it('should create a new database', async () => {
        const client = await buildCleanDB();
        const newSettings = await client.tables.settings.create({
            lastPage: 'hey',
            theme: 'dark',
        });
    });
});
