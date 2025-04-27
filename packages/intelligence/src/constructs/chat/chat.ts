import { DataInterface } from '../data-interface';
import { DatabaseObject } from '../data-interface.types';
import { Thread } from '../thread/thread';
import { ChatProps } from './types';

export class Chat extends DatabaseObject {
    private threadId: string;
    public readonly name: string;

    public static async new(db: DataInterface, props: ChatProps): Promise<Chat> {
        const chat = new Chat(db, props);
        await db.saveChat(chat);
        return chat;
    }

    public static async fromId(db: DataInterface, id: string): Promise<Chat> {
        const chat = await db.loadChat(id);
        return chat;
    }

    private constructor(db: DataInterface, props: ChatProps) {
        super('chat', db, props.id);
        this.threadId = props.threadId;
        this.name = props.name;
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
