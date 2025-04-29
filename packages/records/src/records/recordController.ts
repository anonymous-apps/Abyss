import { PrismaConnection } from '../prisma';
import { TableReferences } from '../prisma.type';
import { generateId } from '../utils/ids';
import { BaseRecordProps } from './recordClass';

export abstract class RecordController<T extends BaseRecordProps> {
    protected readonly recordType: keyof TableReferences;
    protected readonly connection: PrismaConnection;
    protected readonly table: ReturnType<PrismaConnection['_reference']>;
    protected readonly factory: (data: any) => T;

    public constructor(type: keyof TableReferences, connection: PrismaConnection, factory: (data: any) => T) {
        this.recordType = type;
        this.connection = connection;
        this.table = this.connection._reference(type);
        this.factory = factory;
    }

    //
    // Mutators
    //

    async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
        const result = await this.table.create({
            data: {
                ...(data as any),
                id: generateId(this.recordType),
            },
        });
        this.connection.notifyRecord(this.recordType, result);
        return this.factory(result);
    }

    async purge(): Promise<void> {
        await this.table.deleteMany();
        this.connection.notifyTable(this.recordType);
    }

    async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T> {
        const result = await this.table.update({
            where: { id },
            data: data as any,
        });
        this.connection.notifyRecord(this.recordType, result);
        return this.factory(result);
    }

    async delete(id: string): Promise<void> {
        await this.table.delete({ where: { id } });
        this.connection.notifyRecord(this.recordType, null);
    }

    //
    // Getters
    //

    async scan(): Promise<T[]> {
        const result = await this.table.findMany({ orderBy: { createdAt: 'desc' } });
        return result.map(this.factory);
    }

    async get(id: string): Promise<T | null> {
        const result = await this.table.findUnique({ where: { id } });
        return result ? this.factory(result) : null;
    }

    async getOrThrow(id: string): Promise<T> {
        const result = await this.table.findUnique({ where: { id } });
        if (!result) {
            throw new Error(`Record ${this.recordType} with id ${id} not found`);
        }
        return this.factory(result);
    }

    async exists(id: string): Promise<boolean> {
        const result = await this.table.findUnique({ where: { id } });
        return !!result;
    }
}
