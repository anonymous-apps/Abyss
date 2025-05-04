import { existsSync, promises as fs } from 'fs';
import { join } from 'path';
import sqlite3 from 'sqlite3';
import { ReferencedSettingsTable } from '../records/settings';
import { DatabaseSubscriptionLayer } from './database-subscription-layer';
import { migrations } from './schemas/migrations';
import { DBSidecarType, DefaultSidecar, SqliteTables } from './sqlite.type';

export class SQliteClient {
    // Disk locations
    private path: string;
    private sidecarPath: string;
    private dbPath: string;

    // Database itself
    private db!: sqlite3.Database;

    // References to tables
    public readonly tables: SqliteTables;

    // Notifiers
    public events: DatabaseSubscriptionLayer;

    constructor(dbPath: string) {
        this.path = dbPath;
        this.sidecarPath = join(this.path, 'sidecar.json');
        this.dbPath = join(this.path, 'db.sqlite');
        this.events = new DatabaseSubscriptionLayer(this);
        this.tables = {
            settings: new ReferencedSettingsTable(this),
        };
    }

    async initialize() {
        if (!existsSync(this.path)) {
            await fs.mkdir(this.path, { recursive: true });
            await this.setSidecar(DefaultSidecar);
        }
        this.db = new sqlite3.Database(this.dbPath);
    }

    async getSidecar() {
        try {
            const content = await fs.readFile(this.sidecarPath, 'utf8');
            return JSON.parse(content) as DBSidecarType;
        } catch (e) {
            return DefaultSidecar;
        }
    }

    async setSidecar(sidecar: Partial<DBSidecarType>) {
        const current = await this.getSidecar();
        await fs.writeFile(this.sidecarPath, JSON.stringify({ ...current, ...sidecar }, null, 2));
    }

    async execute(sql: string, params: any[] = []) {
        console.log('Executing', sql, params);
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    // Migration handling

    private async applyMigration(id: string) {
        const migration = migrations.find(m => m.from === id);
        if (!migration) {
            return false;
        }
        for (const query of migration.queries) {
            await this.execute(query);
        }
        await this.setSidecar({ databaseVersionId: migration.to });
        return true;
    }

    public async migrateAll(): Promise<void> {
        const sidecar = await this.getSidecar();
        const current = sidecar.databaseVersionId;
        if (await this.applyMigration(current)) {
            return await this.migrateAll();
        }
    }
}
