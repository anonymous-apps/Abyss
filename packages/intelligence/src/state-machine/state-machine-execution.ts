import { GraphNodeDefinition } from './graphs-objects/graph-node';
import { StateGraph } from './graphs-objects/state-graph';
import { NodeHandler } from './node-handler';
import './node-handlers';
import { PortTriggerData } from './types';
import { StateMachineEvent } from './types.events';

export class StateMachineExecution {
    private static maxInvokeCount = 100;
    private invokeCount = 0;
    private executionId: string;
    private stateGraph: StateGraph;
    private evaluationQueue: string[] = [];
    private events: StateMachineEvent[] = [];
    private portValues: Record<string, Record<string, PortTriggerData>> = {};

    constructor(id: string, stateGraph: StateGraph) {
        this.executionId = id;
        this.stateGraph = stateGraph;
    }

    // Events

    public getEvents() {
        return this.events;
    }
    public addEvent(event: StateMachineEvent) {
        this.events.push(event);
    }

    // Private utilites
    private _getPortValue(nodeId: string, portId: string) {
        return this.portValues[nodeId]?.[portId];
    }

    private _setPortValue(nodeId: string, portId: string, value: PortTriggerData) {
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
        const node = this.stateGraph.getNode(nodeId);
        if (node?.inputPorts[portId]?.type === 'signal') {
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
        return this.stateGraph.getConnection(nodeId, portId);
    }

    // Start this graph by triggering an input node
    public async invoke(inputNode: string, portData: PortTriggerData[]) {
        this.addEvent({ type: 'execution-began', executionId: this.executionId });
        try {
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

    private async _invoke(inputNode: string, portData: PortTriggerData[]) {
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
        const node = this.stateGraph.getNode(nodeId);
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
                inputs: this._getPortDataForNode(nodeId),
            });
            const result = await this._resolveNode(node, this._getPortDataForNode(nodeId));
            this.addEvent({
                type: 'node-resolution-completed',
                executionId: this.executionId,
                nodeId: nodeId,
                outputs: result.portData,
            });
        } catch (error) {
            this.addEvent({
                type: 'node-resolution-failed',
                executionId: this.executionId,
                nodeId: nodeId,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
            });
        }

        if (this.evaluationQueue.length > 0) {
            await this._progressEvaluationQueue();
        }
    }

    private async _resolveNode(node: GraphNodeDefinition, portData: PortTriggerData[]) {
        const handler = NodeHandler.getHandler(node);
        const result = await handler.resolve({
            execution: this,
            node: node,
            portData: portData,
        });
        result.portData.forEach(p => this._setPortValue(node.id, p.portId, p));
        return result;
    }
}
