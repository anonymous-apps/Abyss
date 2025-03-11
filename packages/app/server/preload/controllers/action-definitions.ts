import { Prisma } from '@prisma/client';
import { notifyTableChanged, prisma } from '../database-connection';

export const ActionDefinitionsController = {
    removeAll: async () => {
        await prisma.actionDefinitions.deleteMany();
        await notifyTableChanged('ActionDefinitions', '*');
    },
    scanTable: async () => {
        return await prisma.actionDefinitions.findMany({ orderBy: { createdAt: 'desc' } });
    },
    getByRecordId: async (recordId: string) => {
        return await prisma.actionDefinitions.findFirst({ where: { id: recordId } });
    },
    create: async (action: Prisma.ActionDefinitionsCreateInput) => {
        const result = await prisma.actionDefinitions.create({ data: action });
        await notifyTableChanged('ActionDefinitions', result.id);
        return result;
    },
    update: async (id: string, action: Prisma.ActionDefinitionsUpdateInput) => {
        const result = await prisma.actionDefinitions.update({ where: { id }, data: action });
        await notifyTableChanged('ActionDefinitions', id);
        return result;
    },
    delete: async (id: string) => {
        await prisma.actionDefinitions.delete({ where: { id } });
        await notifyTableChanged('ActionDefinitions', id);
    },
    findUnique: async (id: string) => {
        return await prisma.actionDefinitions.findUnique({ where: { id } });
    },
    findByName: async (name: string) => {
        return await prisma.actionDefinitions.findFirst({ where: { name } });
    },
    findByType: async (type: string) => {
        return await prisma.actionDefinitions.findMany({ where: { type } });
    },
};
