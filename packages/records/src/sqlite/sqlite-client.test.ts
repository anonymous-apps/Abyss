import { rmdirSync, unlinkSync } from 'fs';
import { beforeEach, describe, it } from 'vitest';
import { SQliteClient } from './sqlite-client';

describe('SQLiteClient', () => {
    beforeEach(() => {
        try {
            unlinkSync('./test/db.sqlite');
        } catch {}
        try {
            unlinkSync('./test/sidecar.json');
        } catch {}
        try {
            rmdirSync('./test');
        } catch {}
    });

    it('should create a new database', async () => {
        const client = new SQliteClient('./test');
        await client.initialize();
        await client.migrateAll();
        const newSettings = await client.tables.settings.create({
            lastPage: 'hey',
            theme: 'dark',
        });
        console.log({ newSettings });
    });
});
