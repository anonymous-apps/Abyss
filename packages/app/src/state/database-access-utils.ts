import { ModelConnectionRecord, SettingsRecord } from '@abyss/records';
import { TableReferences } from '@abyss/records/dist/prisma.type';
import { useDatabaseQuery, useDatabaseRecord, useDatabaseTableQuery } from './database-connection';

// General access

export function useDatabaseTableScan<T>(table: keyof TableReferences) {
    return useDatabaseTableQuery<T[]>(table, async database => database.table[table].scan() as unknown as Promise<T[]>);
}

export function useDatabaseTables() {
    return useDatabaseQuery(async database => database.describeTables());
}

export function useDatabaseSettings() {
    return useDatabaseRecord<SettingsRecord>('settings', 'settings::default');
}

// Specific access

export function useScanTableModelConnections() {
    return useDatabaseTableScan<ModelConnectionRecord>('modelConnection');
}
