import { existsSync } from 'fs';
import path from 'path';
import { PrismaClient } from '../prisma/prisma';
import { runDatabaseMigration } from './management/runMigration';
import { buildTableReferences, TableReferences } from './prisma.type';
import { randomId } from './utils/ids';

export class PrismaConnection {
    // The Prisma client
    public readonly client: PrismaClient;
    public readonly table: TableReferences;

    constructor({ url }: { url?: string } = {}) {
        const prismaPath = path.join(__dirname, '..', 'prisma', 'dev.db');
        this.client = new PrismaClient({
            datasources: {
                db: {
                    url: 'file:' + (url || prismaPath),
                },
            },
        });
        this.table = buildTableReferences(this);
    }

    public _reference(table: string) {
        // Using this to get type safty even though it's not the best way to do it
        return this.client[table as 'textDocument'];
    }

    // Connection subscriptions - hierarchical structure
    private subscriptions: Record<
        string,
        {
            __table__?: Record<string, (data: any) => void>;
            [recordId: string]: Record<string, (data: any) => void> | undefined;
        }
    > = {};

    public subscribeRecord<T extends keyof TableReferences>(table: T, recordId: string, callback: (record: any) => void) {
        const identifier = randomId();

        if (!this.subscriptions[table]) {
            this.subscriptions[table] = {};
        }

        if (!this.subscriptions[table][recordId]) {
            this.subscriptions[table][recordId] = {};
        }

        this.subscriptions[table][recordId]![identifier] = callback;
        this.table[table].get(recordId).then(record => callback(record));

        return () => {
            delete this.subscriptions[table][recordId]![identifier];

            // Clean up empty objects
            if (Object.keys(this.subscriptions[table][recordId]!).length === 0) {
                delete this.subscriptions[table][recordId];
            }

            if (Object.keys(this.subscriptions[table]).length === 0) {
                delete this.subscriptions[table];
            }
        };
    }

    public subscribeTable<T extends keyof TableReferences>(table: T, callback: (connection: this['table']) => void) {
        const identifier = randomId();

        if (!this.subscriptions[table]) {
            this.subscriptions[table] = {};
        }

        if (!this.subscriptions[table]['__table__']) {
            this.subscriptions[table]['__table__'] = {};
        }

        this.subscriptions[table]['__table__']![identifier] = callback;

        return () => {
            delete this.subscriptions[table]['__table__']![identifier];

            // Clean up empty objects
            if (Object.keys(this.subscriptions[table]['__table__']!).length === 0) {
                delete this.subscriptions[table]['__table__'];
            }

            if (Object.keys(this.subscriptions[table]).length === 0) {
                delete this.subscriptions[table];
            }
        };
    }

    public subscribeDatabase(callback: (connection: this) => void) {
        const identifier = randomId();

        if (!this.subscriptions['__database']) {
            this.subscriptions['__database'] = {};
        }

        if (!this.subscriptions['__database']['__database__']) {
            this.subscriptions['__database']['__database__'] = {};
        }

        this.subscriptions['__database']['__database__']![identifier] = callback;

        return () => {
            delete this.subscriptions['__database']['__database__']![identifier];
        };
    }

    private async notifySubscribers(table: keyof TableReferences, newRecord: any | null | undefined, isTableNotification: boolean = false) {
        if (!this.subscriptions[table]) {
            return;
        }

        // Notify database-level subscribers
        if (this.subscriptions['__database']?.['__database__']) {
            Object.values(this.subscriptions['__database']['__database__']!).forEach(callback => {
                console.log(`[subscribe] notify database subscribers of update to: ${table}`);
                callback(this);
            });
        }

        // Notify table-level subscribers
        if (this.subscriptions[table]['__table__']) {
            Object.values(this.subscriptions[table]['__table__']!).forEach(callback => {
                console.log(`[subscribe] notify table subscribers of update to: ${table}`);
                callback(this.table);
            });
        }

        // For table notifications, notify all record subscribers in this table
        if (isTableNotification) {
            Object.keys(this.subscriptions[table]).forEach(recordId => {
                if (recordId !== '__table__') {
                    Object.values(this.subscriptions[table][recordId]!).forEach(callback => {
                        console.log(`[subscribe] notify record subscribers of update to: ${recordId}`);
                        callback(newRecord);
                    });
                }
            });
        }

        // For record notifications, notify just that specific record's subscribers
        else if (this.subscriptions[table][newRecord?.id]) {
            console.log(`[subscribe] notify record subscribers of update to: ${newRecord?.id}`);
            Object.values(this.subscriptions[table][newRecord.id]!).forEach(callback => {
                callback(newRecord);
            });
        }
    }

    public notifyTable(table: keyof TableReferences) {
        this.notifySubscribers(table, undefined, true);
    }

    public notifyRecord(table: keyof TableReferences, record: any) {
        this.notifySubscribers(table, record, false);
    }

    public async describeTables() {
        const tables = Object.keys(this.table) as (keyof TableReferences)[];
        const result: Record<string, { rows: number; description: string }> = {};

        for (const table of tables) {
            try {
                const count = await this.table[table].count();
                result[table] = { rows: count, description: this.table[table].description };
            } catch (error) {
                result[table] = { rows: 0, description: this.table[table].description };
            }
        }

        return result;
    }

    public async runMigration() {
        await runDatabaseMigration(this);
    }

    public async databaseExists() {
        const dbPath = path.join('~', '.abyss', 'database.sqlite');
        return existsSync(dbPath);
    }
}
