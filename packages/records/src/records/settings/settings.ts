import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import type { SettingsType } from './settings.type';

export class ReferencedSettingsTable extends ReferencedSqliteTable<SettingsType> {
    private static DEFAULT_ID = 'settings::default';

    constructor(client: SQliteClient) {
        super('settings', 'Application settings', client);
    }

    async default() {
        const defaultRef = new ReferencedSettingsRecord(ReferencedSettingsTable.DEFAULT_ID, this.client);
        const exists = await defaultRef.exists();
        if (exists) return await defaultRef.get();
        const defaultSettings = await this.create({
            id: ReferencedSettingsTable.DEFAULT_ID,
            lastPage: '/',
            theme: '',
        });
        return defaultSettings;
    }

    async update(settings: Partial<SettingsType>) {
        const defaultValue = await this.default();
        if (!defaultValue || !defaultValue.id) {
            throw new Error('Default settings or default settings ID not found');
        }
        const defaultRef = new ReferencedSettingsRecord(defaultValue.id, this.client);
        await defaultRef.update(settings);
    }

    ref() {
        return new ReferencedSettingsRecord(ReferencedSettingsTable.DEFAULT_ID, this.client);
    }
}

export class ReferencedSettingsRecord extends ReferencedSqliteRecord<SettingsType> {
    constructor(id: string, client: SQliteClient) {
        super('settings', id, client);
    }
}
