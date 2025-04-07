export type MessageSender = "user" | "bot";

export type TextMessagePartial = {
    type: "text";
    content: string;
};

export type ImageMessagePartial = {
    type: "image";
    base64Data: string;
};

export type ChatMessagePartial = TextMessagePartial | ImageMessagePartial;

export interface ChatTurn {
    sender: MessageSender;
    partials: ChatMessagePartial[];
}

export interface ChatContextProps {
    turns?: ChatTurn[];
}
