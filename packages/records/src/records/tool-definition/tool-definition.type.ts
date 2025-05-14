import { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export type ToolDefinitionHandlerType = 'abyss';
export type ToolDefinitionPropertyType = 'string' | 'number' | 'boolean' | 'raw-json';

export interface ToolDefinitionInputProperty {
    name: string;
    description: string;
    type: ToolDefinitionPropertyType;
}

export interface ToolDefinitionOutputProperty {
    name: string;
    description: string;
    type: ToolDefinitionPropertyType;
}

export interface ToolDefinitionType extends BaseSqliteRecord {
    name: string;
    shortName: string;
    description: string;
    handlerType: ToolDefinitionHandlerType;
    inputSchemaData: ToolDefinitionInputProperty[];
    outputSchemaData: ToolDefinitionOutputProperty[];
    linkedDocumentData?: string[];
}
