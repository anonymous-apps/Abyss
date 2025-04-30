import { PrismaConnection } from '@abyss/records';

export interface InvokeModelDirectlyParams {
    modelConnectionId: string;
    humanMessage: string;
    chatId: string;
    database: PrismaConnection;
}
