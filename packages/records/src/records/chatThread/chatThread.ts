import { RecordClass } from '../recordClass';
import { ChatThreadController } from './chatThread.controller';
import { ChatThread } from './chatThread.type';

export class ChatThreadClass extends RecordClass<ChatThread> {
    public name: string;
    public description: string;
    public threadId: string;
    public participantId: string;

    constructor(controller: ChatThreadController, data: ChatThread) {
        super(controller, data);
        this.name = data.name;
        this.description = data.description;
        this.threadId = data.threadId;
        this.participantId = data.participantId;
    }
}
