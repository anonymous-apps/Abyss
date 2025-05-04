import { BaseSqliteRecord } from '../../sqlite/sqlite.type';
import { Status } from '../../utils/shared.type';

export interface LogMessage {
    level: 'info' | 'error' | 'warning';
    scope: string;
    message: string;
    timestamp: number;
    data?: Record<string, any>;
}

export interface LogStreamType extends BaseSqliteRecord {
    sourceId: string;
    status: Status;
    messagesData: LogMessage[];
}
