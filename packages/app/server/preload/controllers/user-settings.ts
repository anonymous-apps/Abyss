import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface UserSettingsRecord extends BaseRecord {
    lastPage: string;
    theme: string;
    bootstrapped: boolean;
    pageHistory: string[];
}

class _UserSettingsController extends BaseDatabaseConnection<UserSettingsRecord> {
    constructor() {
        super('userSettings', 'User preferences and application settings');
    }

    async get(): Promise<UserSettingsRecord> {
        const first = await this.findFirst();
        if (!first) {
            const created = this.create({
                lastPage: '/',
                theme: 'etherial',
                bootstrapped: false,
                pageHistory: [],
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

    async onPageChange(page: string) {
        const first = await this.get();
        const id = first.id;
        const history: string[] = first.pageHistory || [];
        history.push(page);
        this.update(id, {
            lastPage: page,
            pageHistory: history,
        });
    }

    async popPageHistory() {
        const first = await this.get();
        const id = first.id;
        const history: string[] = first.pageHistory || [];
        const lastPage = history.pop();

        this.update(id, {
            lastPage: history[history.length - 1],
            pageHistory: history,
        });

        return lastPage;
    }
}

export const UserSettingsController = new _UserSettingsController();
