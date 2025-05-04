import { ReferencedSqliteRecord } from '../sqlite/reference-record';
import { ReferencedSqliteTable } from '../sqlite/reference-table';
import { SQliteClient } from '../sqlite/sqlite-client';
import { BaseSqliteRecord } from '../sqlite/sqlite.type';

export interface SettingsType extends BaseSqliteRecord {
    lastPage: string;
    theme: string;
}

export class ReferencedSettingsTable extends ReferencedSqliteTable<SettingsType> {
    private static DEFAULT_ID = 'settings::default';

    constructor(client: SQliteClient) {
        super('settings', 'Application settings', client);
    }

    async default() {
        const defaultRef = new ReferencedSettingsRecord(this.tableId, ReferencedSettingsTable.DEFAULT_ID, this.client);
        const exists = await defaultRef.exists();
        if (exists) return;
        const defaultSettings = await this.create({
            id: ReferencedSettingsTable.DEFAULT_ID,
            lastPage: '/',
            theme: '',
        });
        return defaultSettings;
    }
}

export class ReferencedSettingsRecord extends ReferencedSqliteRecord<SettingsType> {}
