import { mkdirSync, rmdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { randomId } from '../utils/ids';
import { wait } from '../utils/wait';
import { SQliteClient } from './sqlite-client';

export async function buildCleanDB({ setupCommand, doMigrations = true }: { setupCommand?: string; doMigrations?: boolean } = {}) {
    await wait();
    const id = randomId();
    const path = join('.test-artifacts', id);
    mkdirSync(path, { recursive: true });
    try {
        unlinkSync(join(path, 'db.sqlite'));
    } catch {}
    try {
        unlinkSync(join(path, 'sidecar.json'));
    } catch {}
    try {
        rmdirSync(path);
    } catch {}
    const client = new SQliteClient(path);
    await client.initialize();
    if (doMigrations) {
        await client.migrateAll();
    }
    if (setupCommand) {
        await client.execute(setupCommand);
    }
    await wait();
    return client;
}
