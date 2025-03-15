import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface TextLogRecord extends BaseRecord {
    text: string;
}

class _TextLogController extends BaseDatabaseConnection<TextLogRecord> {
    constructor() {
        super('textLog', 'Text logs');
    }
}

export const TextLogController = new _TextLogController();
