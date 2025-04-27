import { GraphConnection } from '../..';
import { GraphNodeDefinition } from '../../state-machine/graphs-objects/graph-node';
import { DataInterface } from '../data-interface';
import { DatabaseObject } from '../data-interface.types';
import { GraphProps } from './types';

export class Graph extends DatabaseObject {
    public readonly name: string;
    private nodes: GraphNodeDefinition[];
    private connections: GraphConnection[];

    public static async new(db: DataInterface, props: GraphProps): Promise<Graph> {
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
        this.name = props.name;
        this.nodes = props.nodes;
        this.connections = props.connections;
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
}
