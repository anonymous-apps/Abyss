import { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export type ToolDefinitionHandlerType = 'abyss';
export type ToolDefinitionPropertyType = 'string' | 'number' | 'boolean';

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
    description: string;
    handlerType: ToolDefinitionHandlerType;
    inputSchemaData: ToolDefinitionInputProperty[];
    outputSchemaData: ToolDefinitionOutputProperty[];
}
