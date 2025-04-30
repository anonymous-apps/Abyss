import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { SettingsRecord } from './settings';
import { SettingsType } from './settings.type';

export class SettingsController extends RecordController<'settings', SettingsType, SettingsRecord> {
    constructor(connection: PrismaConnection) {
        super('settings', 'application settings', connection, data => new SettingsRecord(this, data));
    }

    public async getSettings(): Promise<SettingsRecord> {
        const settings = await this.connection.table.settings.get('settings::default');
        if (!settings) {
            return await this.connection.table.settings.create({
                id: 'settings::default',
                lastPage: '',
                theme: 'etherial',
            });
        }
        return settings;
    }

    public async updateSettings(settings: Partial<SettingsType>) {
        await this.connection.table.settings.update('settings::default', settings);
    }
}
