import type { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export interface ChatThreadType extends BaseSqliteRecord {
    name: string;
    description: string;
    threadId: string;
    participantId: string;
    blockerId?: string | null;
}
