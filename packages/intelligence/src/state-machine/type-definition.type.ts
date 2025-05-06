export type GraphDataType = 'string' | 'number' | 'boolean' | 'thread' | 'chat-model' | 'chat' | 'signal';

export interface GraphPortDefinition {
    id: string;
    type: 'data' | 'signal';
    dataType: GraphDataType;
    name: string;
    description?: string;
    userConfigurable?: boolean | undefined;
}

export interface GraphParameterDefinition {
    id: string;
    type: GraphDataType;
    name: string;
    description: string;
}

export interface GraphNodeDefinition {
    id: string;
    icon: string;
    type: string;
    name: string;
    description: string;
    color: string;
    inputPorts: Record<string, GraphPortDefinition>;
    outputPorts: Record<string, GraphPortDefinition>;
    parameters: Record<string, GraphParameterDefinition>;
}
