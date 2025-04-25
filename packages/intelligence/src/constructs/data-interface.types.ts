import { randomId } from '../utils/ids';
import { DataInterface } from './data-interface';

export abstract class DatabaseObject {
    public readonly id: string;
    public readonly recordType: string;
    public readonly db: DataInterface;

    public constructor(recordType: string, db: DataInterface, id?: string) {
        this.recordType = recordType;
        this.id = id || `${recordType}::${randomId()}`;
        this.db = db;
    }
}
