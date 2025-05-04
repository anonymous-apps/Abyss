import { BaseSqliteRecord } from '../sqlite/sqlite.type';
import { Status } from '../utils/shared.type';

export interface TextPartial {
    type: 'text';
    timestamp: Date;
    payload: {
        content: string;
    };
}

export interface ToolRequestPartial {
    type: 'toolRequest';
    timestamp: Date;
    payload: {
        callId: string;
        shortId: string;
        input: any;
    };
}

export interface ToolResponsePartial {
    type: 'toolResponse';
    timestamp: Date;
    payload: {
        callId: string;
        status: Status;
        output: string;
    };
}

export type MessagePartial = TextPartial | ToolRequestPartial | ToolResponsePartial;

export interface MessageTurn extends BaseSqliteRecord {
    senderId: string;
    partials: MessagePartial[];
}

export interface MessageThreadType extends BaseSqliteRecord {
    turns: MessageTurn[];
}
