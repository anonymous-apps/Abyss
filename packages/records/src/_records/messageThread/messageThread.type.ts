import { Status } from '../../utils/shared.type';
import { BaseRecordProps } from '../recordClass';

export interface MessageThreadType extends BaseRecordProps {
    turns: MessageTurn[];
}

export interface MessageTurn extends BaseRecordProps {
    senderId: string;
    partials: MessagePartial[];
}

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
