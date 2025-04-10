import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface TextLogRecord extends BaseRecord {
    text: string;
}

class _TextLogController extends BaseDatabaseConnection<TextLogRecord> {
    constructor() {
        super('textLog', 'Text logs');
    }

    async empty(): Promise<TextLogRecord> {
        const result = await this.create({ text: '' });
        return result as TextLogRecord;
    }

    async appendToLog(logId: string, text: string): Promise<void> {
        const log = await this.getByRecordId(logId);
        if (!log) {
            throw new Error('Log not found');
        }
        log.text += text;
        await this.update(logId, log);
    }
}

export const TextLogController = new _TextLogController();
