import { GraphConnection } from './graph-connection';
import { GraphNodeDefinition } from './graph-node';

export class StateGraph {
    private nodes: Record<string, GraphNodeDefinition> = {};
    private connectionsByNodeId: Record<string, Record<string, GraphConnection>> = {};

    constructor(nodes: GraphNodeDefinition[] = [], connections: GraphConnection[] = []) {
        this.addNodes(nodes);
        this.addConnections(connections);
    }

    //
    // Building
    //

    public addNodes(nodes: GraphNodeDefinition[]) {
        nodes.forEach(node => this.addNode(node));
    }

    public addNode(node: GraphNodeDefinition) {
        this.nodes[node.id] = node;
    }

    public addConnections(connections: GraphConnection[]) {
        connections.forEach(connection => this.addConnection(connection));
    }

    public addConnection(connection: GraphConnection) {
        if (!this.connectionsByNodeId[connection.sourceNodeId]) {
            this.connectionsByNodeId[connection.sourceNodeId] = {};
        }
        this.connectionsByNodeId[connection.sourceNodeId][connection.sourcePortId] = connection;
    }

    public removeNode(node: GraphNodeDefinition) {
        delete this.nodes[node.id];
    }

    public removeConnection(connection: GraphConnection) {
        delete this.connectionsByNodeId[connection.sourceNodeId][connection.sourcePortId];
    }

    //
    // Access
    //

    public getNode(id: string) {
        return this.nodes[id];
    }

    public getConnection(nodeId: string, portId: string) {
        return this.connectionsByNodeId[nodeId]?.[portId];
    }

    //
    // Serialization
    //

    public save() {
        return JSON.stringify({
            nodes: this.nodes,
            connections: this.connectionsByNodeId,
        });
    }

    public static load(data: string) {
        const graph = new StateGraph();
        const parsedData = JSON.parse(data);
        Object.keys(parsedData.nodes).map(key => {
            graph.addNode(parsedData.nodes[key]);
        });
        Object.keys(parsedData.connections).map(key => {
            graph.addConnection(parsedData.connections[key]);
        });
    }
}
