import { Message } from '@abyss/intelligence';
import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface ResponseStreamRecord extends BaseRecord {
    sourceId: string;
    resultMessages: Message[];
    status: 'streaming' | 'complete' | 'error';
    rawOutput: string;
}

class _ResponseStreamController extends BaseDatabaseConnection<ResponseStreamRecord> {
    constructor() {
        super('responseStream', 'A stream of messages and possibly tool calls from a single model');
    }

    async addMessage(streamId: string, message: Message) {
        const stream = await this.getByRecordId(streamId);
        if (!stream) {
            throw new Error('Stream not found');
        }

        await this.update(streamId, {
            resultMessages: [...stream.resultMessages, message],
        });
    }

    async complete(streamId: string) {
        await this.update(streamId, {
            status: 'complete',
        });
    }

    async error(streamId: string, error: string) {
        await this.update(streamId, {
            status: 'error',
        });
    }

    async updateRawOutput(streamId: string, rawOutput: string) {
        await this.update(streamId, {
            rawOutput,
        });
    }
}

export const ResponseStreamController = new _ResponseStreamController();
