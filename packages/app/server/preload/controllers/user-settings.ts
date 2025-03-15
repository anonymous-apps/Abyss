import { Prisma } from '@prisma/client';
import { BaseDatabaseConnection, BaseRecord } from './_base';
import { notifyTableChanged } from '../database-connection';

export interface UserSettingsRecord extends BaseRecord {
    sidebarOpen: boolean;
    lastPage: string;
    theme: string;
    bootstrapped: boolean;
}

class _UserSettingsController extends BaseDatabaseConnection<UserSettingsRecord> {
    constructor() {
        super('userSettings', 'User preferences and application settings');
    }

    async get(): Promise<UserSettingsRecord> {
        const first = await this.findFirst();
        if (!first) {
            const created = this.create({
                sidebarOpen: true,
                lastPage: '/',
                theme: 'etherial',
                bootstrapped: false,
            });
            return created;
        }
        return first;
    }

    async updateFirst(data: Partial<Omit<UserSettingsRecord, 'id' | 'createdAt' | 'updatedAt'>>) {
        const first = await this.get();
        const id = first.id;
        return this.update(id, data);
    }
}

export const UserSettingsController = new _UserSettingsController();
