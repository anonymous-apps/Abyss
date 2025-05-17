import type { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export interface AgentGraphNode {
    id: string;
    nodeId: string;
    position: {
        x: number;
        y: number;
    };
    parameters: Record<string, unknown>;
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
    nodesData: AgentGraphNode[];
    edgesData: AgentGraphEdge[];
}
