import { PrismaConnection } from '../prisma';
import { TableReferences } from '../prisma.type';
import { generateId } from '../utils/ids';
import { BaseRecordProps, ReferencedDatabaseRecord } from './recordClass';

export abstract class RecordController<
    ITable extends keyof TableReferences,
    IDataType extends BaseRecordProps,
    IReference extends ReferencedDatabaseRecord<IDataType>
> {
    protected readonly recordType: keyof TableReferences;
    public readonly description: string;
    public readonly connection: PrismaConnection;
    protected readonly table: PrismaConnection['client'][ITable];
    protected readonly factory: (id: string) => IReference;

    public constructor(
        type: keyof TableReferences,
        description: string,
        connection: PrismaConnection,
        factory: (id: string) => IReference
    ) {
        this.recordType = type;
        this.description = description;
        this.connection = connection;
        this.table = this.connection.client[type] as unknown as PrismaConnection['client'][ITable];
        this.factory = factory;
    }

    //
    // Mutators
    //

    async create(data: Omit<IDataType, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<IDataType> {
        // @ts-ignore
        const result = await this.table.create({
            data: {
                id: generateId(this.recordType),
                ...(data as any),
            },
        });
        this.connection.notifyRecord(this.recordType, result);
        return result as unknown as IDataType;
    }

    async purge(): Promise<void> {
        // @ts-ignore
        await this.table.deleteMany();
        this.connection.notifyTable(this.recordType);
    }

    async update(id: string, data: Partial<Omit<IDataType, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
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

    async scan(): Promise<IDataType[]> {
        // @ts-ignore
        const result = await this.table.findMany({ orderBy: { createdAt: 'desc' } });
        return result;
    }

    async scanLatest(limit: number = 10): Promise<IDataType[]> {
        // @ts-ignore
        const result = await this.table.findMany({ orderBy: { createdAt: 'desc' }, take: limit });
        return result;
    }

    async get(id: string): Promise<IDataType | null> {
        // @ts-ignore
        const result = await this.table.findUnique({ where: { id } });
        return result;
    }

    async getOrThrow(id: string): Promise<IDataType> {
        // @ts-ignore
        const result = await this.table.findUnique({ where: { id } });
        if (!result) {
            throw new Error(`Record ${this.recordType} with id ${id} not found`);
        }
        return result;
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

    ref(id: string): IReference {
        return this.factory(id);
    }
}
