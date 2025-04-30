import { PrismaConnection } from '../prisma';
import { TableReferences } from '../prisma.type';
import { generateId } from '../utils/ids';
import { BaseRecordProps, RecordClass } from './recordClass';

export abstract class RecordController<ITable extends keyof TableReferences, T extends BaseRecordProps, R extends RecordClass<T>> {
    protected readonly recordType: keyof TableReferences;
    public readonly description: string;
    protected readonly connection: PrismaConnection;
    protected readonly table: PrismaConnection['client'][ITable];
    protected readonly factory: (data: any) => R;

    public constructor(type: keyof TableReferences, description: string, connection: PrismaConnection, factory: (data: any) => R) {
        this.recordType = type;
        this.description = description;
        this.connection = connection;
        this.table = this.connection.client[type] as unknown as PrismaConnection['client'][ITable];
        this.factory = factory;
    }

    //
    // Mutators
    //

    async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<R> {
        // @ts-ignore
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
        // @ts-ignore
        await this.table.deleteMany();
        this.connection.notifyTable(this.recordType);
    }

    async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
        // @ts-ignore
        const result = await this.table.update({
            where: { id },
            data: data as any,
        });
        this.connection.notifyRecord(this.recordType, result);
    }

    async delete(id: string): Promise<void> {
        // @ts-ignore
        await this.table.delete({ where: { id } });
        this.connection.notifyRecord(this.recordType, null);
    }

    //
    // Getters
    //

    async scan(): Promise<R[]> {
        // @ts-ignore
        const result = await this.table.findMany({ orderBy: { createdAt: 'desc' } });
        return result.map(this.factory);
    }

    async scanLatest(limit: number = 10): Promise<R[]> {
        // @ts-ignore
        const result = await this.table.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
        return result.map(this.factory);
    }

    async get(id: string): Promise<R | null> {
        // @ts-ignore
        const result = await this.table.findUnique({ where: { id } });
        return result ? this.factory(result) : null;
    }

    async getOrThrow(id: string): Promise<R> {
        // @ts-ignore
        const result = await this.table.findUnique({ where: { id } });
        if (!result) {
            throw new Error(`Record ${this.recordType} with id ${id} not found`);
        }
        return this.factory(result);
    }

    async exists(id: string): Promise<boolean> {
        // @ts-ignore
        const result = await this.table.findUnique({ where: { id } });
        return !!result;
    }

    async count(): Promise<number> {
        // @ts-ignore
        const result = await this.table.count();
        return result;
    }
}
