import { ToolDefinition } from '../../operations/invoke-graph/types';

export type MessageSender = 'user' | 'bot' | 'system';

export type ToolDefinitionAddedMessagePartial = {
    type: 'toolDefinitionAdded';
    toolDefinitionAdded: {
        toolDefinitions: ToolDefinition[];
    };
};

export type ToolDefinitionRemovedMessagePartial = {
    type: 'toolDefinitionRemoved';
    toolDefinitionRemoved: {
        toolDefinitions: ToolDefinition[];
    };
};

export type TextMessagePartial = {
    type: 'text';
    text: {
        content: string;
    };
};

export type ImageMessagePartial = {
    type: 'image';
    image: {
        base64Data: string;
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

export type ThreadMessagePartial =
    | TextMessagePartial
    | ImageMessagePartial
    | ToolRequestMessagePartial
    | ToolResponseMessagePartial
    | ToolDefinitionAddedMessagePartial
    | ToolDefinitionRemovedMessagePartial;

export interface ThreadTurn {
    sender: MessageSender;
    partials: ThreadMessagePartial[];
}

export interface ThreadProps {
    id: string;
    turns: ThreadTurn[];
}
