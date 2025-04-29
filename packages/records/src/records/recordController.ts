import { PrismaConnection, TableReferences } from '../prisma';
import { generateId } from '../utils/ids';

export interface BaseRecordProps {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export abstract class RecordController<T extends BaseRecordProps> {
    protected readonly recordType: keyof TableReferences;
    protected readonly connection: PrismaConnection;
    protected readonly table: ReturnType<PrismaConnection['_reference']>;

    public constructor(type: keyof TableReferences, connection: PrismaConnection) {
        this.recordType = type;
        this.connection = connection;
        this.table = this.connection._reference(type);
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
        return result as unknown as T;
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
        return result as unknown as T;
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
        return result as unknown as T[];
    }

    async get(id: string): Promise<T | null> {
        const result = await this.table.findUnique({ where: { id } });
        return result as unknown as T | null;
    }

    async exists(id: string): Promise<boolean> {
        const result = await this.table.findUnique({ where: { id } });
        return !!result;
    }
}
