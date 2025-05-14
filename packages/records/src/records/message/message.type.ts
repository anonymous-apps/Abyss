import { BaseSqliteRecord } from '../../sqlite/sqlite.type';
import { Status } from '../../utils/shared.type';

export interface TextPartial extends BaseSqliteRecord {
    type: 'text';
    senderId: string;
    payloadData: {
        content: string;
    };
    referencedData?: Record<string, string>;
}

export interface NewToolDefinitionPartial extends BaseSqliteRecord {
    type: 'new-tool-definition';
    senderId: string;
    payloadData: {
        tools: {
            toolId: string;
            shortName: string;
            description: string;
            inputSchemaData: Record<string, any>;
            outputSchemaData: Record<string, any>;
        }[];
    };
    referencedData?: Record<string, string>;
}

export interface RemoveToolDefinitionPartial extends BaseSqliteRecord {
    type: 'remove-tool-definition';
    senderId: string;
    payloadData: {
        tools: string[];
    };
    referencedData?: Record<string, string>;
}

export interface ToolCallRequestPartial extends BaseSqliteRecord {
    type: 'tool-call-request';
    senderId: string;
    payloadData: {
        shortName: string;
        toolCallId: string;
        toolId: string;
        parameters: Record<string, any>;
    };
    referencedData?: Record<string, string>;
}

export interface ToolCallResponsePartial extends BaseSqliteRecord {
    type: 'tool-call-response';
    senderId: string;
    payloadData: {
        toolCallId: string;
        shortName: string;
        status: Status;
        result: string;
    };
    referencedData?: Record<string, string>;
}

export interface SystemErrorPartial extends BaseSqliteRecord {
    type: 'system-error';
    senderId: string;
    payloadData: {
        error: string;
        message: string;
        body: string;
    };
    referencedData?: Record<string, string>;
}

export interface ReadonlyDocumentPartial extends BaseSqliteRecord {
    type: 'readonly-document';
    senderId: string;
    payloadData: {
        documentIds: string[];
    };
}

export type MessageType =
    | TextPartial
    | NewToolDefinitionPartial
    | RemoveToolDefinitionPartial
    | ToolCallRequestPartial
    | ToolCallResponsePartial
    | ReadonlyDocumentPartial
    | SystemErrorPartial;
