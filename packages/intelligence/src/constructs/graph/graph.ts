import { GraphConnection } from '../../state-machine/graphs-objects/graph-connection';
import { GraphNodeDefinition } from '../../state-machine/graphs-objects/graph-node';
import { DataInterface } from '../data-interface';
import { DatabaseObject } from '../data-interface.types';
import { GraphProps } from './types';

export class Graph extends DatabaseObject {
    public readonly name: string;
    public readonly description: string;
    private nodes: GraphNodeDefinition[];
    private connections: GraphConnection[];
    private nodeParameters: Record<string, Record<string, any>>;

    public static async new(db: DataInterface, props: GraphProps = {}): Promise<Graph> {
        const graph = new Graph(db, props);
        await db.saveGraph(graph);
        return graph;
    }

    public static async fromId(db: DataInterface, id: string): Promise<Graph> {
        const graph = await db.loadGraph(id);
        return graph;
    }

    private constructor(db: DataInterface, props: GraphProps) {
        super('graph', db, props.id);
        this.name = props.name || '';
        this.description = props.description || '';
        this.nodes = props.nodes ?? [];
        this.connections = props.connections ?? [];
        this.nodeParameters = props.nodeParameters ?? {};
    }

    //
    // Data
    //

    public getNodes(): GraphNodeDefinition[] {
        return this.nodes;
    }

    public getConnections(): GraphConnection[] {
        return this.connections;
    }

    public getNodeParameters(nodeId: string): Record<string, any> {
        return this.nodeParameters[nodeId] ?? {};
    }

    public async setNodeParameters(nodeId: string, parameters: Record<string, any>): Promise<Graph> {
        this.nodeParameters[nodeId] = parameters;
        await this.db.saveGraph(this);
        return this;
    }

    public async setNodes(nodes: GraphNodeDefinition[]): Promise<Graph> {
        this.nodes = nodes;
        await this.db.saveGraph(this);
        return this;
    }

    public async setConnections(connections: GraphConnection[]): Promise<Graph> {
        this.connections = connections;
        await this.db.saveGraph(this);
        return this;
    }

    public getNode(nodeId: string): GraphNodeDefinition | undefined {
        return this.nodes.find(node => node.id === nodeId);
    }

    public getConnection(nodeId: string, portId: string): GraphConnection | undefined {
        return this.connections.find(connection => connection.sourceNodeId === nodeId && connection.sourcePortId === portId);
    }

    public getParametersForNode(nodeId: string): Record<string, any> {
        return this.nodeParameters[nodeId] ?? {};
    }
}
