import { Chat } from './chat/chat';
import { DataInterface } from './data-interface';
import { Graph } from './graph/graph';
import { Thread } from './thread/thread';

export class MockedDataInterface extends DataInterface {
    private _records: Record<string, any> = {};

    public async saveThread(thread: Thread) {
        this._records[thread.id] = thread;
    }

    public async loadThread(id: string) {
        return this._records[id];
    }

    public async saveChat(chat: Chat) {
        this._records[chat.id] = chat;
    }

    public async loadChat(id: string) {
        return this._records[id];
    }

    public async saveIntelligence(intelligence: any) {
        this._records[intelligence.id] = intelligence;
    }

    public async loadIntelligence(id: string) {
        return this._records[id];
    }

    public async saveGraph(graph: Graph) {
        this._records[graph.id] = graph;
    }

    public async loadGraph(id: string) {
        return this._records[id];
    }
}
