export type MessageSender = 'user' | 'bot' | 'system';

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
    args: Record<string, any>;
    output?: string;
};

export type ChatMessagePartial = TextMessagePartial | ImageMessagePartial | ToolCallMessagePartial;

export interface ChatTurn {
    sender: MessageSender;
    partials: ChatMessagePartial[];
}

export interface ChatContextProps {
    turns?: ChatTurn[];
}
