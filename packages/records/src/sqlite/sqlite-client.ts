import { existsSync, promises as fs, mkdirSync } from 'fs';
import { join } from 'path';
import sqlite3 from 'sqlite3';
import { ReferencedAgentGraphTable } from '../records/agent-graph/agent-graph';
import { ReferencedChatThreadTable } from '../records/chat-thread/chat-thread';
import { ReferencedLogStreamTable } from '../records/logstream/logstream';
import { ReferencedMessageThreadTable } from '../records/message-thread/message-thread';
import { ReferencedMessageTable } from '../records/message/message';
import { ReferencedMetricTable } from '../records/metric/metric';
import { ReferencedModelConnectionTable } from '../records/model-connection/model-connection';
import { ReferencedSettingsTable } from '../records/settings/settings';
import { ReferencedToolDefinitionTable } from '../records/tool-definition/tool-definition';
import { DatabaseSubscriptionLayer } from './database-subscription-layer';
import { ReferencedSqliteTable } from './reference-table';
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
        mkdirSync(this.path, { recursive: true });
        this.events = new DatabaseSubscriptionLayer(this);
        this.tables = {
            settings: new ReferencedSettingsTable(this),
            modelConnection: new ReferencedModelConnectionTable(this),
            agentGraph: new ReferencedAgentGraphTable(this),
            chatThread: new ReferencedChatThreadTable(this),
            messageThread: new ReferencedMessageThreadTable(this),
            metric: new ReferencedMetricTable(this),
            message: new ReferencedMessageTable(this),
            logStream: new ReferencedLogStreamTable(this),
            toolDefinition: new ReferencedToolDefinitionTable(this),
        };
    }

    async overrideTable(tableId: keyof SqliteTables, table: ReferencedSqliteTable<any>) {
        this.tables[tableId] = table as any;
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
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('[SQliteClient]', sql, params, err);
                    reject(err);
                }
                resolve(rows);
            });
        });
    }

    // Describe tables

    async describeTables() {
        const tables: Partial<Record<keyof SqliteTables, { rows: number; description: string }>> = {};
        for (const table of Object.keys(this.tables)) {
            const result = await this.tables[table as keyof SqliteTables].count();
            tables[table as keyof SqliteTables] = {
                rows: result,
                description: this.tables[table as keyof SqliteTables].description,
            };
        }
        return tables;
    }

    // Subscription handling

    subscribeDatabase(callback: () => void) {
        return this.events.subscribeDatabase(callback);
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
