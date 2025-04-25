import { randomId } from '../utils/ids';
import { GraphNodeDefinition } from './graphs-objects/graph-node';
import { NodeExecutionResult, ResolveNodeData } from './types';

export abstract class NodeHandler {
    private id: string;
    private static registry: Record<string, NodeHandler> = {};

    constructor(id: string) {
        this.id = id;
        NodeHandler.registry[id] = this;
    }

    static getHandler(node: GraphNodeDefinition): NodeHandler {
        if (!NodeHandler.registry[node.type]) {
            throw new Error(`No handler found for node type ${node.type}`);
        }
        return NodeHandler.registry[node.type];
    }

    // Definition
    public getDefinition(id: string = randomId()): GraphNodeDefinition {
        return {
            id,
            type: this.id,
            ...this._getDefinition(),
        };
    }
    protected abstract _getDefinition(): Omit<GraphNodeDefinition, 'id' | 'type'>;

    // Resolution
    async resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        return this._resolve(data);
    }
    protected abstract _resolve(data: ResolveNodeData): Promise<NodeExecutionResult>;
}
