import { ReferencedDatabaseRecord } from '../recordClass';
import { SettingsController } from './settings.controller';
import { SettingsType } from './settings.type';

export class SettingsRecord extends ReferencedDatabaseRecord<SettingsType> {
    constructor(controller: SettingsController, id: string) {
        super(controller, id);
    }
}
