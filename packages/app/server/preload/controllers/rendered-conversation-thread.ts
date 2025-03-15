import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface RenderedConversationThreadRecord extends BaseRecord {
    messages: any;
}

class _RenderedConversationThreadController extends BaseDatabaseConnection<RenderedConversationThreadRecord> {
    constructor() {
        super('renderedConversationThread', 'A rendering of a point in time of a thread as it was sent to an api call');
    }
}

export const RenderedConversationThreadController = new _RenderedConversationThreadController();
