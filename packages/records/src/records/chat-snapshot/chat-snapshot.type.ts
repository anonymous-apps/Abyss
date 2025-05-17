import type { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export interface ChatSnapshot extends BaseSqliteRecord {
    messagesData: ChatSnapshotMessage[];
}

export interface ChatSnapshotUserMessage {
    type: 'user';
    content: string;
}

export interface ChatSnapshotAssistantMessage {
    type: 'assistant';
    content: string;
}

export interface ChatSnapshotCompleteMessage {
    type: 'completion';
    content: string;
}

export type ChatSnapshotMessage = ChatSnapshotUserMessage | ChatSnapshotAssistantMessage | ChatSnapshotCompleteMessage;
