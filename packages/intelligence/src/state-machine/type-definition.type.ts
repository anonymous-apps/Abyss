import { GraphPortData } from '../../dist/state-machine/graphs-objects/graph-port';

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
    inputPorts: Record<string, GraphPortData>;
    outputPorts: Record<string, GraphPortData>;
}
