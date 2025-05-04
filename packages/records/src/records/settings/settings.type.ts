import { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export interface SettingsType extends BaseSqliteRecord {
    lastPage: string;
    theme: string;
}
