import path from 'path';
import { PrismaClient } from '../prisma/prisma';
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
            __table__?: Record<string, (connection: TableReferences) => void>;
            [recordId: string]: Record<string, (record: any) => void> | undefined;
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

    private async notifySubscribers(table: keyof TableReferences, newRecord: any | null | undefined, isTableNotification: boolean = false) {
        if (!this.subscriptions[table]) {
            return;
        }

        // Notify table-level subscribers
        if (this.subscriptions[table]['__table__']) {
            Object.values(this.subscriptions[table]['__table__']!).forEach(callback => {
                callback(this.table);
            });
        }

        // If we don't know about the record, get it
        if (newRecord === undefined) {
            newRecord = await this.table[table].get(newRecord.id);
        }

        // For table notifications, notify all record subscribers in this table
        if (isTableNotification) {
            Object.keys(this.subscriptions[table]).forEach(recordId => {
                if (recordId !== '__table__') {
                    Object.values(this.subscriptions[table][recordId]!).forEach(callback => {
                        callback(newRecord);
                    });
                }
            });
        }

        // For record notifications, notify just that specific record's subscribers
        else if (this.subscriptions[table][newRecord?.id]) {
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

    // This is very hacky, but it allows the electron render process to directly call methods on the PrismaConnection instance
    // This means that the UI (and not just the main process) can directly subscribe to and update table records
    // Not ideal, but it works for now and would slow down development speed if this is changed
    // TODO: Find a better solution in the future
    export(): this {
        const exportedMethods: Record<string, any> = {};

        // First, include own properties (if any are functions)
        Object.getOwnPropertyNames(this)
            .filter(name => name !== 'constructor' && name !== 'export')
            .forEach(name => {
                const property = this[name as keyof this];
                if (typeof property === 'function') {
                    exportedMethods[name] = property.bind(this);
                }
            });

        // Then, traverse the prototype chain to get inherited methods
        let proto = Object.getPrototypeOf(this);
        while (proto && proto !== Object.prototype) {
            Object.getOwnPropertyNames(proto)
                .filter(name => name !== 'constructor' && name !== 'export')
                .forEach(name => {
                    // Only add if not already added (i.e. not overridden in the instance)
                    if (!(name in exportedMethods)) {
                        const descriptor = Object.getOwnPropertyDescriptor(proto, name);
                        if (descriptor && typeof descriptor.value === 'function') {
                            exportedMethods[name] = descriptor.value.bind(this);
                        }
                    }
                });
            proto = Object.getPrototypeOf(proto);
        }

        return exportedMethods as unknown as this;
    }
}
