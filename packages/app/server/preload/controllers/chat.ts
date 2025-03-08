import { Prisma } from '@prisma/client';
import { notifyTableChanged, prisma } from '../database-connection';

export const ChatController = {
    scanTable: async () => {
        return await prisma.chat.findMany({ orderBy: { createdAt: 'desc' } });
    },
    getByRecordId: async (recordId: string) => {
        return await prisma.chat.findFirst({ where: { id: recordId } });
    },
    create: async (chat: Prisma.ChatCreateInput) => {
        const result = await prisma.chat.create({ data: chat });
        await notifyTableChanged('Chat', result.id);
        return result;
    },
    update: async (id: string, chat: Prisma.ChatUpdateInput) => {
        const result = await prisma.chat.update({ where: { id }, data: chat });
        await notifyTableChanged('Chat', id);
        return result;
    },
    delete: async (id: string) => {
        const chat = await prisma.chat.findUnique({ where: { id } });
        if (chat) {
            // Delete the associated message thread
            await prisma.messageThread.delete({ where: { id: chat.threadId } });
        }
        await prisma.chat.delete({ where: { id } });
        await notifyTableChanged('Chat', id);
    },
    findUnique: async (id: string) => {
        return await prisma.chat.findUnique({ where: { id } });
    },
    createWithThread: async (chat: Omit<Prisma.ChatCreateInput, 'threadId'>) => {
        const thread = await prisma.messageThread.create({
            data: {
                status: 'active',
            },
        });
        const result = await prisma.chat.create({
            data: {
                ...chat,
                threadId: thread.id,
            },
        });

        await notifyTableChanged('MessageThread', thread.id);
        await notifyTableChanged('Chat', result.id);
        return result;
    },
};
