import { Message } from '@abyss/intelligence';
import { BaseDatabaseConnection, BaseRecord } from './_base';
import { ModelConnectionsRecord } from './model-connections';

export interface ResponseStreamRecord extends BaseRecord {
    sourceId: string;
    parsedMessages: Message[];
    status: 'streaming' | 'complete';
    rawOutput: string;
}

class _ResponseStreamController extends BaseDatabaseConnection<ResponseStreamRecord> {
    constructor() {
        super('responseStream', 'A stream of messages and possibly tool calls from a single model');
    }

    async createFromModelConnection(connection: ModelConnectionsRecord) {
        return await this.create({
            sourceId: connection.id,
            parsedMessages: [],
            status: 'streaming',
            rawOutput: '',
        });
    }
    async addMessage(streamId: string, message: Message) {
        const stream = await this.getByRecordId(streamId);
        if (!stream) {
            throw new Error('Stream not found');
        }
        await this.update(streamId, {
            parsedMessages: [...stream.parsedMessages, message],
        });
    }

    async updateMessage(streamId: string, message: Message) {
        const stream = await this.getByRecordId(streamId);
        if (!stream) {
            throw new Error('Stream not found');
        }
        await this.update(streamId, {
            parsedMessages: stream.parsedMessages.map(m => (m.uuid === message.uuid ? message : m)),
        });
    }

    async complete(streamId: string) {
        await this.update(streamId, {
            status: 'complete',
        });
    }

    async updateRawOutput(streamId: string, rawOutput: string) {
        await this.update(streamId, {
            rawOutput,
        });
    }
}

export const ResponseStreamController = new _ResponseStreamController();
