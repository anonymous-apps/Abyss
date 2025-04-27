export interface ChatProps {
    id?: string;
    name?: string;
    threadId?: string;
}

export interface ChatPropsWithThread extends ChatProps {
    threadId: string;
}
