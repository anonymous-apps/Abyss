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

    public static getById(id: string): NodeHandler {
        return NodeHandler.registry[id];
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

    public isStaticData(): boolean {
        return this.type === 'static';
    }

    public getAllPortIds(): string[] {
        return Object.keys(this._getDefinition().inputPorts);
    }

    // Resolution
    async resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        return this._resolve(data);
    }
    protected _resolve(data: ResolveNodeData): Promise<NodeExecutionResult> {
        throw new Error('Not implemented');
    }
}
