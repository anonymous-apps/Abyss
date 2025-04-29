import { randomId } from '../utils/ids';
import { NodeExecutionResult, ResolveNodeData } from './type-base.type';
import { GraphNodeDefinition } from './type-definition.type';

export abstract class NodeHandler {
    private id: string;
    private type: 'static' | 'trigger' | 'dynamic';
    private static registry: Record<string, NodeHandler> = {};

    constructor(id: string, type: 'static' | 'trigger' | 'dynamic') {
        this.id = id;
        this.type = type;
        NodeHandler.registry[id] = this;
    }

    static getHandler(node: GraphNodeDefinition): NodeHandler {
        if (!NodeHandler.registry[node.type]) {
            throw new Error(`No handler found for node type ${node.type}`);
        }
        return NodeHandler.registry[node.type];
    }

    static isStaticData(node: GraphNodeDefinition): boolean {
        return NodeHandler.getHandler(node).type === 'static';
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

    public isSignalPort(portId: string): boolean {
        return this._getDefinition().inputPorts[portId].type === 'signal';
    }

    // Resolution
    async resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        return this._resolve(data);
    }
    protected abstract _resolve(data: ResolveNodeData): Promise<NodeExecutionResult>;
}
