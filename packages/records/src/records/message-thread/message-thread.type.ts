import { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export interface MessageThreadType extends BaseSqliteRecord {
    messages: {
        id: string;
    }[];
}
