import { Prisma } from '@prisma/client';
import { notifyTableChanged, prisma } from '../database-connection';

export const MessageThreadController = {
    scanTable: async () => {
        return await prisma.messageThread.findMany();
    },
    getByRecordId: async (recordId: string) => {
        return await prisma.messageThread.findFirst({ where: { id: recordId } });
    },
    create: async (thread: Prisma.MessageThreadCreateInput) => {
        const result = await prisma.messageThread.create({ data: thread });
        await notifyTableChanged('MessageThread', result.id);
        return result;
    },
    update: async (id: string, thread: Prisma.MessageThreadUpdateInput) => {
        const result = await prisma.messageThread.update({ where: { id }, data: thread });
        await notifyTableChanged('MessageThread', id);
        return result;
    },
    delete: async (id: string) => {
        await prisma.messageThread.delete({ where: { id } });
        await notifyTableChanged('MessageThread', id);
    },
    findUnique: async (id: string) => {
        return await prisma.messageThread.findUnique({ where: { id } });
    },
    addMessage: async (threadId: string, message: Omit<Prisma.MessageCreateInput, 'threadId'>) => {
        const result = await prisma.message.create({
            data: {
                ...message,
                threadId,
            },
        });
        await notifyTableChanged('Message', result.id);
        await notifyTableChanged('MessageThread', threadId);
        return result;
    },
};
