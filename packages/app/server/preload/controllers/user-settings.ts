import { Prisma } from '@prisma/client';
import { notifyTableChanged, prisma } from '../database-connection';

export const UserSettingsController = {
    scanTable: async () => {
        return await prisma.userSettings.findMany();
    },
    getByRecordId: async (recordId: string) => {
        return await prisma.userSettings.findFirst({ where: { id: recordId } });
    },
    get: async () => {
        const existing = await prisma.userSettings.findUnique({ where: { id: 'default' } });
        if (existing) return existing;
        const result = await prisma.userSettings.create({ data: {} });
        await notifyTableChanged('UserSettings', result.id);
        return result;
    },
    update: async (Connection: Prisma.UserSettingsUpdateInput) => {
        const result = await prisma.userSettings.update({ where: { id: 'default' }, data: Connection });
        await notifyTableChanged('UserSettings', 'default');
        return result;
    },
};
