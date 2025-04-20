export type MessageType = 'text' | 'image' | 'toolCall';

export interface BaseMessage {
    type: MessageType;
    uuid: string;
}

export interface TextMessage extends BaseMessage {
    type: 'text';
    content: string;
}

export interface ImageMessage extends BaseMessage {
    type: 'image';
    base64Data: string;
}

export interface ToolCallMessage extends BaseMessage {
    type: 'toolCall';
    name: string;
    args: Record<string, any>;
}

export type Message = TextMessage | ImageMessage | ToolCallMessage;
