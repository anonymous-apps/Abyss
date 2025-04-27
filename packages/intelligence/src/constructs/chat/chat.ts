import { DataInterface } from '../data-interface';
import { DatabaseObject } from '../data-interface.types';
import { Thread } from '../thread/thread';
import { ChatProps, ChatPropsWithThread } from './types';

export class Chat extends DatabaseObject {
    public readonly name: string;
    public readonly participant: string;
    private threadId: string;

    public static async new(db: DataInterface, props: ChatProps): Promise<Chat> {
        if (!props.threadId) {
            const thread = await Thread.new(db);
            props.threadId = thread.id;
        }
        const chat = new Chat(db, props as ChatPropsWithThread);
        await db.saveChat(chat);
        return chat;
    }

    public static async fromId(db: DataInterface, id: string): Promise<Chat> {
        const chat = await db.loadChat(id);
        return chat;
    }

    private constructor(db: DataInterface, props: ChatPropsWithThread) {
        super('chat', db, props.id);
        this.threadId = props.threadId;
        this.name = props.name || '';
        this.participant = props.participant || '';
    }

    //
    // Data
    //

    public async getThread(): Promise<Thread> {
        return Thread.fromId(this.db, this.threadId);
    }

    public async updateThread(newThreadId: string): Promise<Chat> {
        this.threadId = newThreadId;
        await this.db.saveChat(this);
        return this;
    }
}
