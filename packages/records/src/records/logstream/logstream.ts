import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import { SQliteClient } from '../../sqlite/sqlite-client';
import { LogMessage, LogStreamType } from './logstream.type';

export class ReferencedLogStreamTable extends ReferencedSqliteTable<LogStreamType> {
    constructor(client: SQliteClient) {
        super('logStream', 'A stream of log messages from some execution', client);
    }
}

export class ReferencedLogStreamRecord extends ReferencedSqliteRecord<LogStreamType> {
    constructor(id: string, client: SQliteClient) {
        super('logStream', id, client);
    }

    public async addMessage(message: Omit<LogMessage, 'timestamp'>) {
        const data = await this.get();
        const newMessage = { ...message, timestamp: Date.now() };
        data.messages.push(newMessage);
        await this.update(data);
    }
}
