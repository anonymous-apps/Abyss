export type MessageSender = 'user' | 'bot' | 'system';

export type TextMessagePartial = {
    type: 'text';
    text: {
        content: string;
    };
};

export type ToolRequestMessagePartial = {
    type: 'toolRequest';
    toolRequest: {
        callId: string;
        shortId: string;
        name: string;
        args: Record<string, any>;
    };
};

export type ToolResponseMessagePartial = {
    type: 'toolResponse';
    toolResponse: {
        callId: string;
        output: string;
    };
};

export type ThreadMessagePartial = TextMessagePartial | ToolRequestMessagePartial | ToolResponseMessagePartial;

export interface ThreadTurn {
    sender: MessageSender;
    partials: ThreadMessagePartial[];
}

export interface ThreadProps {
    id?: string;
    turns?: ThreadTurn[];
}
