import { ReferencedDatabaseRecord } from '../recordClass';
import { RecordController } from '../recordController';
import { AgentGraphEdge, AgentGraphNode, AgentGraphType } from './agentGraph.type';

export class AgentGraphRecord extends ReferencedDatabaseRecord<AgentGraphType> {
    constructor(controller: RecordController<'agentGraph', AgentGraphType, AgentGraphRecord>, id: string) {
        super(controller, id);
    }

    public async setNodeParameters(nodeId: string, parameters: Record<string, any>): Promise<AgentGraphRecord> {
        const data = await this.getOrThrow();
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

    public async setNodePosition(nodeId: string, position: { x: number; y: number }): Promise<AgentGraphRecord> {
        const data = await this.getOrThrow();
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

    public async setNodes(nodes: AgentGraphNode[]): Promise<AgentGraphRecord> {
        await this.update({ nodes });
        return this;
    }

    public async setConnections(connections: AgentGraphEdge[]): Promise<AgentGraphRecord> {
        await this.update({ edges: connections });
        return this;
    }
}
