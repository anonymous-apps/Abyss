import { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export interface TextPartial extends BaseSqliteRecord {
    type: 'text';
    senderId: string;
    payload: {
        content: string;
    };
}

export type MessageType = TextPartial;
