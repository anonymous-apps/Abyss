import { SettingsRecord } from '@abyss/records';
import { TableReferences } from '@abyss/records/dist/prisma.type';
import { useDatabaseQuery, useDatabaseRecord, useDatabaseTableQuery } from './database-connection';

// General access

export function useDatabaseTableScan(table: keyof TableReferences) {
    return useDatabaseTableQuery(table, async database => database.table[table].scan());
}

export function useDatabaseTables() {
    return useDatabaseQuery(async database => database.describeTables());
}

export function useDatabaseSettings() {
    return useDatabaseRecord<SettingsRecord>('settings', 'settings::default');
}
