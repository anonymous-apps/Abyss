export type MessageSender = 'user' | 'bot';

export type TextMessagePartial = {
    type: 'text';
    content: string;
};

export type ImageMessagePartial = {
    type: 'image';
    base64Data: string;
};

export type ToolCallMessagePartial = {
    type: 'toolCall';
    callId: string;
    name: string;
    arguments: Record<string, any>;
};

export type ToolResultMessagePartial = {
    type: 'toolResult';
    callId: string;
    result: any;
};

export type ChatMessagePartial = TextMessagePartial | ImageMessagePartial | ToolCallMessagePartial | ToolResultMessagePartial;

export interface ChatTurn {
    sender: MessageSender;
    partials: ChatMessagePartial[];
}

export interface ChatContextProps {
    turns?: ChatTurn[];
}
