import { Prisma } from '@prisma/client';
import { notifyTableChanged, prisma } from '../database-connection';

export const RenderedThreadController = {
    removeAll: async () => {
        await prisma.renderedConversationThread.deleteMany();
        await notifyTableChanged('renderedThread', '*');
    },
    scanTable: async () => {
        return await prisma.renderedConversationThread.findMany();
    },
    getByRecordId: async (recordId: string) => {
        return await prisma.renderedConversationThread.findFirst({ where: { id: recordId } });
    },
    create: async (renderedThread: Prisma.RenderedConversationThreadCreateInput) => {
        const result = await prisma.renderedConversationThread.create({ data: renderedThread });
        await notifyTableChanged('renderedThread', result.id);
        return result;
    },
    update: async (id: string, renderedThread: Prisma.RenderedConversationThreadUpdateInput) => {
        const result = await prisma.renderedConversationThread.update({ where: { id }, data: renderedThread });
        await notifyTableChanged('renderedThread', id);
        return result;
    },
    delete: async (id: string) => {
        await prisma.renderedConversationThread.delete({ where: { id } });
        await notifyTableChanged('renderedThread', id);
    },
    findUnique: async (id: string) => {
        return await prisma.renderedConversationThread.findUnique({ where: { id } });
    },
    findMany: async (where?: Prisma.RenderedConversationThreadWhereInput) => {
        return await prisma.renderedConversationThread.findMany({ where });
    },
};
