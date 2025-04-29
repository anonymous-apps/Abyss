import { RecordController } from './recordController';

export interface BaseRecordProps {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export abstract class RecordClass<T extends BaseRecordProps> {
    public readonly controller: RecordController<T>;

    public id: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(controller: RecordController<T>, data: T) {
        this.controller = controller;
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    public async save() {
        return this.controller.update(this.id, this as any);
    }

    public async delete() {
        return this.controller.delete(this.id);
    }
}
