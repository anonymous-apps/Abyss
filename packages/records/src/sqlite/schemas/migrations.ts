import { Migration } from './type';
import { BaseSettingsTable } from './version-1';

export const migrations: Migration[] = [
    {
        from: 'NONE',
        to: '0.0.1',
        queries: [BaseSettingsTable],
    },
];
