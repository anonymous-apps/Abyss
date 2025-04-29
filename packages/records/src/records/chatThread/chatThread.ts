import { RecordClass } from '../recordClass';
import { ChatThreadController } from './chatThread.controller';
import { ChatThreadType } from './chatThread.type';

export class ChatThreadRecord extends RecordClass<ChatThreadType> {
    public name: string;
    public description: string;
    public threadId: string;
    public participantId: string;

    constructor(controller: ChatThreadController, data: ChatThreadType) {
        super(controller, data);
        this.name = data.name;
        this.description = data.description;
        this.threadId = data.threadId;
        this.participantId = data.participantId;
    }

    public async setThreadId(threadId: string) {
        this.threadId = threadId;
        await this.save();
    }
}
