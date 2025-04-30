import { PrismaConnection } from '@abyss/records';

export interface InvokeModelDirectlyParams {
    modelConnectionId: string;
    chatId: string;
    database: PrismaConnection;
}
