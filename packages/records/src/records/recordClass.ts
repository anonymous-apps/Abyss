import { TableReferences } from '../prisma.type';
import { RecordController } from './recordController';

export interface BaseRecordProps {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export abstract class ReferencedDatabaseRecord<IDataType extends BaseRecordProps> {
    public readonly controller: RecordController<keyof TableReferences, IDataType, ReferencedDatabaseRecord<IDataType>>;
    public id: string;

    constructor(controller: RecordController<keyof TableReferences, IDataType, ReferencedDatabaseRecord<IDataType>>, id: string) {
        this.controller = controller;
        this.id = id;
    }

    public async get() {
        return await this.controller.get(this.id);
    }

    public async getOrThrow() {
        return await this.controller.getOrThrow(this.id);
    }

    public async update(data: Partial<IDataType>) {
        return await this.controller.update(this.id, data);
    }

    public async delete() {
        await this.controller.delete(this.id);
    }
}
