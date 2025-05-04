import { ReferencedSqliteRecord } from '../sqlite/reference-record';
import { ReferencedSqliteTable } from '../sqlite/reference-table';
import { SQliteClient } from '../sqlite/sqlite-client';
import { AgentGraphEdge, AgentGraphNode, AgentGraphType } from './agent-graph.types';

export class ReferencedAgentGraphTable extends ReferencedSqliteTable<AgentGraphType> {
    constructor(client: SQliteClient) {
        super('agentGraph', 'A graph representing an agent workflow with nodes and edges', client);
    }
}

export class ReferencedAgentGraphRecord extends ReferencedSqliteRecord<AgentGraphType> {
    public async setNodeParameters(nodeId: string, parameters: Record<string, any>): Promise<ReferencedAgentGraphRecord> {
        const data = await this.get();
        const nodes = data.nodes ?? [];
        const nodeIndex = nodes.findIndex(node => node.id === nodeId);
        if (nodeIndex === -1) {
            throw new Error(`Node with id ${nodeId} not found`);
        }
        const updatedNodes = [...nodes];
        updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            parameters,
        };
        await this.update({ nodes: updatedNodes });
        return this;
    }

    public async setNodePosition(nodeId: string, position: { x: number; y: number }): Promise<ReferencedAgentGraphRecord> {
        const data = await this.get();
        const nodes = data.nodes ?? [];
        const nodeIndex = nodes.findIndex(node => node.id === nodeId);
        if (nodeIndex === -1) {
            throw new Error(`Node with id ${nodeId} not found`);
        }
        const updatedNodes = [...nodes];
        updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            position,
        };
        await this.update({ nodes: updatedNodes });
        return this;
    }

    public async setNodes(nodes: AgentGraphNode[]): Promise<ReferencedAgentGraphRecord> {
        await this.update({ nodes });
        return this;
    }

    public async setConnections(connections: AgentGraphEdge[]): Promise<ReferencedAgentGraphRecord> {
        await this.update({ edges: connections });
        return this;
    }
}
