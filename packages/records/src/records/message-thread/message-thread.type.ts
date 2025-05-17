import type { BaseSqliteRecord } from '../../sqlite/sqlite.type';
import type { MessageType } from '../message/message.type';

export interface MessageThreadType extends BaseSqliteRecord {
    messagesData: {
        id: string;
    }[];
}

export interface MessageThreadTurn {
    senderId: string;
    messages: MessageType[];
}
