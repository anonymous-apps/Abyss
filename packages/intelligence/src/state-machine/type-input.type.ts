export interface GraphInputEventOnUserChat {
    type: 'onUserChat';
    chatId: string;
}

export type GraphInputEvent = GraphInputEventOnUserChat;
