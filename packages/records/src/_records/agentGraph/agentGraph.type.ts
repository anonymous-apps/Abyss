import { BaseRecordProps } from '../recordClass';

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

export interface AgentGraphType extends BaseRecordProps {
    name: string;
    description: string;
    nodes: AgentGraphNode[];
    edges: AgentGraphEdge[];
}
