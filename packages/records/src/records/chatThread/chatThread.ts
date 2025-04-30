import { MessagePartial } from '../messageThread/messageThread.type';
import { RecordClass } from '../recordClass';
import { ChatThreadController } from './chatThread.controller';
import { ChatThreadType } from './chatThread.type';

export class ChatThreadRecord extends RecordClass<ChatThreadType> {
    public name: string;
    public description: string;
    public threadId: string;
    public participantId: string;
    public blocker?: string | null;

    constructor(controller: ChatThreadController, data: ChatThreadType) {
        super(controller, data);
        this.name = data.name;
        this.description = data.description;
        this.threadId = data.threadId;
        this.participantId = data.participantId;
        this.blocker = data.blocker;
    }

    public async addPartial(senderId: string, ...messages: Omit<MessagePartial, 'timestamp'>[]) {
        const messageThread = await this.controller.connection.table.messageThread.getOrThrow(this.threadId);
        const updatedMessageThread = await messageThread.addPartial(senderId, ...messages);
        await this.setThreadId(updatedMessageThread.id);
    }

    public async addHumanPartial(...messages: Omit<MessagePartial, 'timestamp'>[]) {
        await this.addPartial('human', ...messages);
    }

    public async setThreadId(threadId: string) {
        this.threadId = threadId;
        await this.save();
    }

    public async block(blocker: string) {
        this.blocker = blocker;
        await this.save();
    }

    public async unblock() {
        this.blocker = null;
        await this.save();
    }
}
