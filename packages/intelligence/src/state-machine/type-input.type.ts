export interface GraphInputEventOnUserChat {
    type: 'onUserChat';
    chatId: string;
    message: string;
}

export type GraphInputEvent = GraphInputEventOnUserChat;
