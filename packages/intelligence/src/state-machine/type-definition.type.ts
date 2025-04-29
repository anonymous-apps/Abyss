export type PortDataType = 'string' | 'number' | 'boolean' | 'thread' | 'chat-model' | 'chat';

export interface GraphPortDefinition {
    id: string;
    type: 'data' | 'signal';
    dataType: PortDataType;
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
}
