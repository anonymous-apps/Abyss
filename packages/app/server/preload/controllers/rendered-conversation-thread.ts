import { ChatThread } from '@abyss/intelligence';
import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface RenderedConversationThreadRecord extends BaseRecord {
    messages: string;
}

class _RenderedConversationThreadController extends BaseDatabaseConnection<RenderedConversationThreadRecord> {
    constructor() {
        super('renderedConversationThread', 'A rendering of a point in time of a thread as it was sent to an api call');
    }

    async createFromThread(thread: ChatThread) {
        const renderedThread = await this.create({
            messages: thread.serialize(),
        });
        return renderedThread;
    }
}

export const RenderedConversationThreadController = new _RenderedConversationThreadController();
