import { AgentGraphRecord } from '@abyss/records';
import { NodeHandler } from './node-handler';
import './node-handlers';
import { Nodes } from './node-handlers';
import { PortTriggerData } from './type-base.type';
import { GraphNodeDefinition } from './type-definition.type';
import { StateMachineEvent } from './type-events.type';

export class StateMachineExecution {
    private static maxInvokeCount = 100;
    private invokeCount = 0;
    private executionId: string;

    // References
    private graph: AgentGraphRecord;

    // Execution
    private evaluationQueue: string[] = [];
    private events: StateMachineEvent[] = [];
    private portValues: Record<string, Record<string, PortTriggerData<any>>> = {};
    private staticNodesEvaluated: Set<string> = new Set();

    constructor(id: string, graph: AgentGraphRecord) {
        this.executionId = id;
        this.graph = graph;
    }

    // Events

    public getEvents() {
        return this.events;
    }

    public addEvent(event: StateMachineEvent) {
        this.events.push(event);
    }

    // Private utilites

    private _setPortValue(nodeId: string, portId: string, value: PortTriggerData<any>) {
        if (!this.portValues[nodeId]) {
            this.portValues[nodeId] = {};
        }
        this.portValues[nodeId][portId] = value;

        // If the port is connected to another node, set the value of that port
        const connection = this._getConnectionOutofPort(nodeId, portId);
        if (connection) {
            this._setPortValue(connection.targetNodeId, connection.targetPortId, {
                portId: connection.targetPortId,
                dataType: value.dataType,
                inputValue: value.inputValue,
            });
            return;
        }

        // If this port is an input signal, add the node to the evaluation queue
        const node = this.graph.getNode(nodeId);
        const nodeDefinition = Nodes[node?.nodeId as keyof typeof Nodes];
        if (nodeDefinition?.isSignalPort(portId)) {
            this._addEvaluationQueue(nodeId);
        }
    }

    private _addEvaluationQueue(nodeId: string) {
        if (this.evaluationQueue.includes(nodeId)) {
            return;
        }
        this.evaluationQueue.push(nodeId);
    }

    private _getPortDataForNode(nodeId: string) {
        return Object.values(this.portValues[nodeId] ?? {});
    }

    private _getConnectionOutofPort(nodeId: string, portId: string) {
        return this.graph.getConnection(nodeId, portId);
    }

    private _doesNodeHaveAllPortsResolved(nodeId: string) {
        const node = this.graph.getNode(nodeId);
        return Object.values(node?.inputPorts ?? {}).every(p => this.portValues[nodeId]?.[p.id]);
    }

    public async invoke(inputNode: string, portData: PortTriggerData<any>[]) {
        this.addEvent({ type: 'execution-began', executionId: this.executionId });
        try {
            await this._evaluateStaticNodes();
            await this._invoke(inputNode, portData);
            this.addEvent({ type: 'execution-completed', executionId: this.executionId });
        } catch (error) {
            this.addEvent({
                type: 'execution-failed',
                executionId: this.executionId,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            });
        }
    }

    private async _evaluateStaticNodes() {
        const staticNodes = this.graph.getNodes().filter(n => NodeHandler.isStaticData(n));
        let didEvaluate = true;
        while (didEvaluate) {
            didEvaluate = false;
            for (const node of staticNodes) {
                const allResolved = this._doesNodeHaveAllPortsResolved(node.id);
                const hasEvaluated = this.staticNodesEvaluated.has(node.id);
                if (allResolved && !hasEvaluated) {
                    await this._invoke(node.id, this._getPortDataForNode(node.id));
                    this.staticNodesEvaluated.add(node.id);
                    didEvaluate = true;
                }
            }
        }
    }

    private async _invoke(inputNode: string, portData: PortTriggerData<any>[]) {
        portData.forEach(p => this._setPortValue(inputNode, p.portId, p));
        this._addEvaluationQueue(inputNode);
        await this._progressEvaluationQueue();
    }

    private async _progressEvaluationQueue() {
        if (this.evaluationQueue.length === 0) {
            return;
        }
        const nodeId = this.evaluationQueue.shift();
        if (!nodeId) {
            return;
        }
        const node = this.graph.getNode(nodeId);
        if (!node) {
            throw new Error(`Node ${nodeId} not found`);
        }
        this.invokeCount++;
        if (this.invokeCount > StateMachineExecution.maxInvokeCount) {
            throw new Error('Max invoke count reached');
        }

        try {
            this.addEvent({
                type: 'node-resolution-began',
                executionId: this.executionId,
                nodeId: nodeId,
                nodeType: node.type,
                inputs: this._getPortDataForNode(nodeId),
            });
            const result = await this._resolveNode(node, this._getPortDataForNode(nodeId));
            this.addEvent({
                type: 'node-resolution-completed',
                executionId: this.executionId,
                nodeId: nodeId,
                nodeType: node.type,
                outputs: result.portData,
            });
        } catch (error) {
            this.addEvent({
                type: 'node-resolution-failed',
                executionId: this.executionId,
                nodeId: nodeId,
                nodeType: node.type,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            });
        }

        if (this.evaluationQueue.length > 0) {
            await this._progressEvaluationQueue();
        }
    }

    private async _resolveNode(node: GraphNodeDefinition, portData: PortTriggerData<any>[]) {
        const handler = NodeHandler.getHandler(node);
        const result = await handler.resolve({
            execution: this,
            node: node,
            portData: portData,
            resolvePort: (id: string) => portData.find(p => p.portId === id)?.inputValue,
            parameters: this.graph.getParametersForNode(node.id),
            db: this.db,
        });
        result.portData.forEach(p => this._setPortValue(node.id, p.portId, p));
        return result;
    }
}
