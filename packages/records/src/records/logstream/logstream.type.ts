import type { BaseSqliteRecord } from '../../sqlite/sqlite.type';
import type { Status } from '../../utils/shared.type';

export interface LogMessage {
    level: 'info' | 'error' | 'warning';
    scope: string;
    message: string;
    timestamp: number;
    data?: Record<string, any>;
}

export interface LogStreamType extends BaseSqliteRecord {
    sourceId: string;
    type: string;
    status: Status;
    completedAt?: number;
    messagesData: LogMessage[];
}
