import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import { SQliteClient } from '../../sqlite/sqlite-client';
import { SettingsType } from './settings.type';

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
        const defaultRef = new ReferencedSettingsRecord(defaultValue!.id, this.client);
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
