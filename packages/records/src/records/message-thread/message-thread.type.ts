import type { BaseSqliteRecord } from '../../sqlite/sqlite.type';
import type { MessageType } from '../message/message.type';

export interface MessageThreadType extends BaseSqliteRecord {
    name: string;
    participantId?: string | null;
    blockerId?: string | null;
    messagesData: {
        id: string;
    }[];
}

export interface MessageThreadTurn {
    senderId: string;
    messages: MessageType[];
}
