import { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export interface AgentGraphNode {
    id: string;
    nodeId: string;
    position: {
        x: number;
        y: number;
    };
    parameters: any;
}

export interface AgentGraphEdge {
    id: string;
    sourceNodeId: string;
    sourcePortId: string;
    targetNodeId: string;
    targetPortId: string;
}

export interface AgentGraphType extends BaseSqliteRecord {
    name: string;
    description: string;
    nodes: AgentGraphNode[];
    edges: AgentGraphEdge[];
}
