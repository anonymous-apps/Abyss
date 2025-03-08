import { Prisma } from '@prisma/client';
import { notifyTableChanged, prisma } from '../database-connection';

export const ApiCallController = {
    scanTable: async () => {
        return await prisma.apiCall.findMany();
    },
    getByRecordId: async (recordId: string) => {
        return await prisma.apiCall.findFirst({ where: { id: recordId } });
    },
    create: async (apiCall: Prisma.ApiCallCreateInput) => {
        const result = await prisma.apiCall.create({ data: apiCall });
        await notifyTableChanged('ApiCall', result.id);
        return result;
    },
    update: async (id: string, apiCall: Prisma.ApiCallUpdateInput) => {
        const result = await prisma.apiCall.update({ where: { id }, data: apiCall });
        await notifyTableChanged('ApiCall', id);
        return result;
    },
    delete: async (id: string) => {
        await prisma.apiCall.delete({ where: { id } });
        await notifyTableChanged('ApiCall', id);
    },
    findUnique: async (id: string) => {
        return await prisma.apiCall.findUnique({ where: { id } });
    },
    findMany: async (where?: Prisma.ApiCallWhereInput) => {
        return await prisma.apiCall.findMany({ where });
    },
};
