import { RecordClass } from '../recordClass';
import { SettingsController } from './settings.controller';
import { SettingsType } from './settings.type';

export class Settings extends RecordClass<SettingsType> {
    public lastPage: string;
    public theme: string;

    constructor(controller: SettingsController, data: SettingsType) {
        super(controller, data);
        this.lastPage = data.lastPage;
        this.theme = data.theme;
    }
}
