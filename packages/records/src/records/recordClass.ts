import { TableReferences } from '../prisma.type';
import { RecordController } from './recordController';

export interface BaseRecordProps {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export abstract class RecordClass<T extends BaseRecordProps> {
    public readonly controller: RecordController<keyof TableReferences, T, RecordClass<T>>;

    public id: string;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(controller: RecordController<keyof TableReferences, T, RecordClass<T>>, data: T) {
        this.controller = controller;
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    private serialize(): T {
        const result: any = {};

        for (const key of Object.keys(this)) {
            if (key !== 'controller' && typeof this[key as keyof this] !== 'function') {
                result[key] = this[key as keyof this];
            }
        }

        return result as T;
    }

    public async save() {
        await this.controller.update(this.id, this.serialize());
    }

    public async delete() {
        await this.controller.delete(this.id);
    }
}
