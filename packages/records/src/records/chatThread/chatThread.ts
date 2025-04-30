import { MessagePartial } from '../messageThread/messageThread.type';
import { ReferencedDatabaseRecord } from '../recordClass';
import { ChatThreadController } from './chatThread.controller';
import { ChatThreadType } from './chatThread.type';

export class ChatThreadRecord extends ReferencedDatabaseRecord<ChatThreadType> {
    constructor(controller: ChatThreadController, id: string) {
        super(controller, id);
    }

    public async addPartial(senderId: string, ...messages: Omit<MessagePartial, 'timestamp'>[]) {
        const data = await this.getOrThrow();
        if (!data.threadId) {
            throw new Error('Thread ID is required');
        }
        const messageThread = this.controller.connection.table.messageThread.ref(data.threadId);
        const updatedMessageThread = await messageThread.addPartial(senderId, ...messages);
        await this.update({ threadId: updatedMessageThread.id });
    }

    public async addHumanPartial(...messages: Omit<MessagePartial, 'timestamp'>[]) {
        await this.addPartial('human', ...messages);
    }

    public async setThreadId(threadId: string) {
        await this.update({ threadId });
    }

    public async block(blocker: string) {
        await this.update({ blocker });
    }

    public async unblock() {
        await this.update({ blocker: null });
    }
}
