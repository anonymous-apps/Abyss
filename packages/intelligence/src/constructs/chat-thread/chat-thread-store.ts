import { StorageController } from "../../storage";
import { ChatThread } from "./chat-thread";

export class ChatThreadStore {
    private storage: StorageController;

    constructor(storage: StorageController) {
        this.storage = storage;
    }

    private generateId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    public async save(thread: ChatThread, id: string = this.generateId()): Promise<string> {
        await this.storage.save(id, thread.serialize());
        return id;
    }

    public async load(id: string): Promise<ChatThread> {
        const serialized = await this.storage.read(id);
        if (!serialized) {
            throw new Error(`Chat thread with id ${id} not found`);
        }
        return ChatThread.deserialize(serialized as any);
    }
}
