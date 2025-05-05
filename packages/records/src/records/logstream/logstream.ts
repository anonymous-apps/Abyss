import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import { SQliteClient } from '../../sqlite/sqlite-client';
import { generateId } from '../../utils/ids';
import { safeSerialize } from '../../utils/serialization';
import { LogMessage, LogStreamType } from './logstream.type';

export class ReferencedLogStreamTable extends ReferencedSqliteTable<LogStreamType> {
    constructor(client: SQliteClient) {
        super('logStream', 'A stream of log messages from some execution', client);
    }

    public async new(sourceType: string, sourceId: string) {
        const newLogStream = await this.create({
            type: sourceType,
            status: 'inProgress',
            messagesData: [],
            completedAt: 0,
            sourceId,
        });
        return new ReferencedLogStreamRecord(newLogStream.id, this.client);
    }

    public ref(id: string) {
        return new ReferencedLogStreamRecord(id, this.client);
    }
    public async scanOfType(type: string): Promise<LogStreamType[]> {
        const data = await this.client.execute(`SELECT * FROM logStream WHERE type = ? ORDER BY createdAt DESC`, [type]);
        return (data as any[]).map(row => ReferencedSqliteTable.deserialize<LogStreamType>(row));
    }

    public async scanBySourceId(sourceId: string): Promise<LogStreamType[]> {
        const data = await this.client.execute(`SELECT * FROM logStream WHERE sourceId = ? ORDER BY createdAt DESC`, [sourceId]);
        return (data as any[]).map(row => ReferencedSqliteTable.deserialize<LogStreamType>(row));
    }
}

export class ReferencedLogStreamRecord extends ReferencedSqliteRecord<LogStreamType> {
    constructor(id: string, client: SQliteClient) {
        super('logStream', id, client);
    }

    public async addMessage(message: Omit<LogMessage, 'timestamp' | 'id'>) {
        const data = await this.get();
        const newMessage = { timestamp: Date.now(), id: generateId('logMessage'), ...message };
        newMessage.data = safeSerialize(newMessage.data || {});
        data.messagesData.push(newMessage);
        await this.update(data);
    }

    public async log(scope: string, message: string, data: Record<string, any> = {}) {
        console.log(scope, message, data);
        await this.addMessage({ scope, message, data, level: 'info' });
    }

    public async warn(scope: string, message: string, data: Record<string, any> = {}) {
        console.warn(scope, message, data);
        await this.addMessage({ scope, message, data, level: 'warning' });
    }

    public async error(scope: string, message: string, data: Record<string, any> = {}) {
        console.error(scope, message, data);
        await this.addMessage({ scope, message, data, level: 'error' });
    }

    public async success() {
        await this.update({ status: 'success', completedAt: Date.now() });
    }

    public async fail() {
        await this.update({ status: 'failed', completedAt: Date.now() });
    }
}
