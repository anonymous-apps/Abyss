import { SQliteClient } from '@abyss/records';

export interface InvokeModelDirectlyParams {
    modelConnectionId: string;
    humanMessage: string;
    chatId: string;
    database: SQliteClient;
}
