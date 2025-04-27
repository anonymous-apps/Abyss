export interface ChatProps {
    id?: string;
    name?: string;
    threadId?: string;
    participant: string;
}

export interface ChatPropsWithThread extends ChatProps {
    threadId: string;
}
