import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { Settings } from './settings';
import { SettingsType } from './settings.type';

export class SettingsController extends RecordController<SettingsType, Settings> {
    constructor(connection: PrismaConnection) {
        super('settings', connection, data => new Settings(this, data));
    }
}
