import { notifyTableChanged, prisma } from '../database-connection';

export interface BaseRecord {
    id: string;
    references?: Record<string, string>;
    createdAt: Date;
    updatedAt: Date;
}

export class BaseDatabaseConnection<T extends BaseRecord> {
    constructor(private tableName: string, public description: string) {}

    protected getTable(): any {
        return prisma[this.tableName as keyof typeof prisma];
    }

    protected async notifyChange(record?: { id: string }): Promise<void> {
        const recordId: string | undefined = record ? record.id : undefined;
        await notifyTableChanged(this.tableName, recordId);
    }

    async removeAll(): Promise<void> {
        await this.getTable().deleteMany();
        await notifyTableChanged(this.tableName, '*');
    }

    async scanTable(): Promise<T[]> {
        return (await this.getTable().findMany({ orderBy: { createdAt: 'desc' } })) as T[];
    }

    async getByRecordId(recordId: string): Promise<T | null> {
        return (await this.getTable().findFirst({ where: { id: recordId } })) as T | null;
    }

    async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
        const result: T = await this.getTable().create({ data });
        await this.notifyChange(result);
        return result;
    }

    async update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T> {
        const initial = await this.getByRecordId(id);
        const newData = { ...initial, ...data, references: { ...initial?.references, ...data.references } };
        const result: T = await this.getTable().update({ where: { id }, data: newData });
        await this.notifyChange(result);
        return result;
    }

    async delete(id: string): Promise<void> {
        await this.getTable().delete({ where: { id } });
        await this.notifyChange({ id });
    }

    async findById(id: string): Promise<T | null> {
        return (await this.getTable().findUnique({ where: { id } })) as T | null;
    }

    async findMany(options?: any): Promise<T[]> {
        return (await this.getTable().findMany(options)) as T[];
    }

    async findFirst(options?: any): Promise<T | null> {
        return (await this.getTable().findFirst(options)) as T | null;
    }

    async deleteMany(options?: any): Promise<void> {
        await this.getTable().deleteMany(options);
    }

    export(): this {
        const exportedMethods: Record<string, any> = {
            description: this.description,
        };

        // First, include own properties (if any are functions)
        Object.getOwnPropertyNames(this)
            .filter(name => name !== 'constructor' && name !== 'export')
            .forEach(name => {
                const property = this[name];
                if (typeof property === 'function') {
                    exportedMethods[name] = property.bind(this);
                }
            });

        // Then, traverse the prototype chain to get inherited methods
        let proto = Object.getPrototypeOf(this);
        while (proto && proto !== Object.prototype) {
            Object.getOwnPropertyNames(proto)
                .filter(name => name !== 'constructor' && name !== 'export')
                .forEach(name => {
                    // Only add if not already added (i.e. not overridden in the instance)
                    if (!(name in exportedMethods)) {
                        const descriptor = Object.getOwnPropertyDescriptor(proto, name);
                        if (descriptor && typeof descriptor.value === 'function') {
                            exportedMethods[name] = descriptor.value.bind(this);
                        }
                    }
                });
            proto = Object.getPrototypeOf(proto);
        }

        return exportedMethods as unknown as this;
    }
}
