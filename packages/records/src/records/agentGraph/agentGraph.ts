import { RecordClass } from '../recordClass';
import { RecordController } from '../recordController';
import { AgentGraphEdge, AgentGraphNode, AgentGraphType } from './agentGraph.type';

export class AgentGraphRecord extends RecordClass<AgentGraphType> {
    public name: string;
    public description: string;
    public nodes: AgentGraphNode[];
    public edges: AgentGraphEdge[];

    constructor(controller: RecordController<AgentGraphType>, data: AgentGraphType) {
        super(controller, data);
        this.name = data.name;
        this.description = data.description;
        this.nodes = data.nodes;
        this.edges = data.edges;
    }

    public getNodes(): AgentGraphNode[] {
        return this.nodes;
    }

    public getNode(nodeId: string): AgentGraphNode | undefined {
        return this.nodes.find(node => node.id === nodeId);
    }

    public getConnections(): AgentGraphEdge[] {
        return this.edges;
    }

    public getConnection(nodeId: string, portId: string): AgentGraphEdge | undefined {
        return this.edges.find(edge => edge.sourceNodeId === nodeId && edge.sourcePortId === portId);
    }

    public async setNodeParameters(nodeId: string, parameters: Record<string, any>): Promise<AgentGraphRecord> {
        const node = this.getNode(nodeId);
        if (!node) {
            throw new Error(`Node with id ${nodeId} not found`);
        }
        node.parameters = parameters;
        await this.save();
        return this;
    }

    public async setNodePosition(nodeId: string, position: { x: number; y: number }): Promise<AgentGraphRecord> {
        const node = this.getNode(nodeId);
        if (!node) {
            throw new Error(`Node with id ${nodeId} not found`);
        }
        node.position = position;
        await this.save();
        return this;
    }

    public async setNodes(nodes: AgentGraphNode[]): Promise<AgentGraphRecord> {
        this.nodes = nodes;
        await this.save();
        return this;
    }

    public async setConnections(connections: AgentGraphEdge[]): Promise<AgentGraphRecord> {
        this.edges = connections;
        await this.save();
        return this;
    }
}
