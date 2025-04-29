import { BaseRecordProps } from '../recordClass';
import { Status } from '../shared.type';

export interface MessageThread extends BaseRecordProps {
    turns: MessageTurn[];
}

export interface MessageTurn extends BaseRecordProps {
    senderId: string;
    partials: MessagePartial[];
}

export interface TextPartial {
    type: 'text';
    payload: {
        content: string;
    };
}

export interface ToolRequestPartial {
    type: 'toolRequest';
    payload: {
        callId: string;
        shortId: string;
        input: any;
    };
}

export interface ToolResponsePartial {
    type: 'toolResponse';
    payload: {
        callId: string;
        status: Status;
        output: string;
    };
}

export type MessagePartial = TextPartial | ToolRequestPartial | ToolResponsePartial;
