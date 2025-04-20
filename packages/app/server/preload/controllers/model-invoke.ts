import { Message } from '@abyss/intelligence/dist/parser/messages.types';
import { BaseDatabaseConnection, BaseRecord } from './_base';
import { ModelConnectionsRecord } from './model-connections';

export interface ModelInvokeRecord extends BaseRecord {
    sourceId: string;
    parsedMessages: Message[];
    rawOutput: string;
}

class _ModelInvokeController extends BaseDatabaseConnection<ModelInvokeRecord> {
    constructor() {
        super('ModelInvoke', 'A stream of messages and possibly tool calls from a single model');
    }

    async createFromModelConnection(connection: ModelConnectionsRecord) {
        return await this.create({
            sourceId: connection.id,
            parsedMessages: [],
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

    async updateRawOutput(streamId: string, rawOutput: string) {
        await this.update(streamId, {
            rawOutput,
        });
    }
}

export const ModelInvokeController = new _ModelInvokeController();
