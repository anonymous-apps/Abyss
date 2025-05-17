import { ReferencedSqliteRecord } from '../../sqlite/reference-record';
import { ReferencedSqliteTable } from '../../sqlite/reference-table';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import type { AgentGraphEdge, AgentGraphNode, AgentGraphType } from './agent-graph.type';

export class ReferencedAgentGraphTable extends ReferencedSqliteTable<AgentGraphType> {
    constructor(client: SQliteClient) {
        super('agentGraph', 'A graph representing an agent workflow with nodes and edges', client);
    }

    public ref(id: string) {
        return new ReferencedAgentGraphRecord(id, this.client);
    }
}

export class ReferencedAgentGraphRecord extends ReferencedSqliteRecord<AgentGraphType> {
    constructor(id: string, client: SQliteClient) {
        super('agentGraph', id, client);
    }

    public async setNodeParameters(nodeId: string, parameters: Record<string, any>) {
        const data = await this.get();
        const nodeIndex = data.nodesData.findIndex(node => node.id === nodeId);
        if (nodeIndex === -1) {
            throw new Error(`Node with id ${nodeId} not found`);
        }
        data.nodesData[nodeIndex].parameters = parameters;
        await this.update(data);
    }

    public async setNodePosition(nodeId: string, position: { x: number; y: number }) {
        const data = await this.get();
        const nodeIndex = data.nodesData.findIndex(node => node.id === nodeId);
        if (nodeIndex === -1) {
            throw new Error(`Node with id ${nodeId} not found`);
        }
        data.nodesData[nodeIndex].position = position;
        await this.update(data);
    }

    public async setNodes(nodes: AgentGraphNode[]): Promise<ReferencedAgentGraphRecord> {
        await this.update({ nodesData: nodes });
        return this;
    }

    public async setConnections(connections: AgentGraphEdge[]): Promise<ReferencedAgentGraphRecord> {
        await this.update({ edgesData: connections });
        return this;
    }
}
