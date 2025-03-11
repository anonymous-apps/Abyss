import { Prisma } from '@prisma/client';
import { notifyTableChanged, prisma } from '../database-connection';

export const MessageController = {
    removeAll: async () => {
        await prisma.message.deleteMany();
        await notifyTableChanged('Message', '*');
    },
    scanTable: async () => {
        return await prisma.message.findMany();
    },
    getByRecordId: async (recordId: string) => {
        return await prisma.message.findFirst({ where: { id: recordId } });
    },
    create: async (message: Prisma.MessageCreateInput) => {
        const result = await prisma.message.create({ data: message });
        await notifyTableChanged('Message', result.id);
        return result;
    },
    update: async (id: string, message: Prisma.MessageUpdateInput) => {
        const result = await prisma.message.update({ where: { id }, data: message });
        await notifyTableChanged('Message', id);
        return result;
    },
    delete: async (id: string) => {
        await prisma.message.delete({ where: { id } });
        await notifyTableChanged('Message', id);
    },
    findUnique: async (id: string) => {
        return await prisma.message.findUnique({ where: { id } });
    },
    forThread: async (threadId: string) => {
        return await prisma.message.findMany({ where: { threadId }, orderBy: { createdAt: 'asc' } });
    },
};
