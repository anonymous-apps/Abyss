import { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export interface TextPartial extends BaseSqliteRecord {
    type: 'text';
    senderId: string;
    payloadData: {
        content: string;
    };
}

export type MessageType = TextPartial;
