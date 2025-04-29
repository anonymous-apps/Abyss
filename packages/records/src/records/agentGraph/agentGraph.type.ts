import { BaseRecordProps } from '../recordClass';

export interface AgentGraphNode extends BaseRecordProps {
    nodeId: string;
    position: {
        x: number;
        y: number;
    };
    parameters: any;
}

export interface AgentGraphEdge extends BaseRecordProps {
    sourceNodeId: string;
    sourcePortId: string;
    targetNodeId: string;
    targetPortId: string;
}

export interface AgentGraph extends BaseRecordProps {
    name: string;
    description: string;
    nodes: AgentGraphNode[];
    edges: AgentGraphEdge[];
}
