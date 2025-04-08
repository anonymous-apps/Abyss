export type TextMessage = {
    type: 'text';
    content: string;
    completed: boolean;
};

export type ImageMessage = {
    type: 'image';
    base64Data: string;
    completed: boolean;
};

export type ToolCallMessage = {
    type: 'toolCall';
    callId: string;
    name: string;
    arguments: Record<string, any>;
    completed: boolean;
};

export type Message = TextMessage | ImageMessage | ToolCallMessage;

export type MessageEventCallback = (message: Message) => void;
export type TextMessageEventCallback = (message: TextMessage) => void;
export type ImageMessageEventCallback = (message: ImageMessage) => void;
export type ToolCallEventCallback = (toolCall: ToolCallMessage) => void;
