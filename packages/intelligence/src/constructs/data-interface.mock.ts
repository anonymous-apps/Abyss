import { DataInterface } from './data-interface';
import { Thread } from './thread';

export class MockedDataInterface extends DataInterface {
    private _records: Record<string, any> = {};

    public async saveThread(thread: Thread) {
        this._records[thread.id] = thread;
    }

    public async loadThread(id: string) {
        return this._records[id];
    }

    public async saveIntelligence(intelligence: any) {
        this._records[intelligence.id] = intelligence;
    }

    public async loadIntelligence(id: string) {
        return this._records[id];
    }
}
