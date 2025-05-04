import { AgentGraphType, ReferencedLogStreamRecord, SQliteClient } from '@abyss/records';
import { Log } from '../utils/logs';
import { NodeHandler } from './node-handler';
import './node-handlers';
import { PortTriggerData } from './type-base.type';
import { GraphInputEvent } from './type-input.type';

export class StateMachineExecution {
    private static maxInvokeCount = 100;
    private invokeCount = 0;

    // References
    public readonly graph: AgentGraphType;
    private executionRecord: ReferencedLogStreamRecord;
    private database: SQliteClient;

    // Execution
    private evaluationQueue: string[] = [];
    private portValues: Record<string, Record<string, PortTriggerData<any>>> = {};
    private staticNodesEvaluated: Set<string> = new Set();

    constructor(graph: AgentGraphType, executionRecord: ReferencedLogStreamRecord, database: SQliteClient) {
        this.graph = graph;
        this.executionRecord = executionRecord;
        this.database = database;
    }

    // Private utilites

    private _setPortValue(nodeId: string, portId: string, value: PortTriggerData<any>) {
        if (!this.portValues[nodeId]) {
            this.portValues[nodeId] = {};
        }
        this.portValues[nodeId][portId] = value;

        // If the port is connected to another node, set the value of that port
        const connections = this._getConnectionsOutofPort(nodeId, portId);
        connections.forEach(c => {
            this._setPortValue(c.targetNodeId, c.targetPortId, {
                portId: c.targetPortId,
                dataType: value.dataType,
                inputValue: value.inputValue,
            });
        });

        // If this port is an input signal, add the node to the evaluation queue
        const node = this._getNode(nodeId);
        const nodeDefinition = NodeHandler.getById(node?.nodeId as string);
        if (nodeDefinition?.isSignalPort(portId)) {
            this._addEvaluationQueue(nodeId);
        }

        // If the target node is a static node, and its not been evaluated, and it has all its input ports resolved, add it to the evaluation queue
        if (nodeDefinition?.isStaticData() && !this.staticNodesEvaluated.has(nodeId) && this._nodeHasAllInputPortsResolved(nodeId)) {
            this._addEvaluationQueue(nodeId);
        }
    }

    private _addEvaluationQueue(nodeId: string) {
        if (this.evaluationQueue.includes(nodeId)) {
            return;
        }
        Log.log('state-machine', `Queue now is [${[...this.evaluationQueue, nodeId].join(', ')}] for execution ${this.executionRecord.id}`);
        this.evaluationQueue.push(nodeId);
    }

    private _getPortDataForNode(nodeId: string) {
        return Object.values(this.portValues[nodeId] ?? {});
    }

    private _getPortMap(portData: PortTriggerData<any>[]) {
        return portData.reduce((acc, p) => {
            acc[p.portId] = p.inputValue;
            return acc;
        }, {} as Record<string, any>);
    }

    private _getConnectionsOutofPort(nodeId: string, portId: string) {
        return this.graph.edgesData.filter(e => e.sourceNodeId === nodeId && e.sourcePortId === portId);
    }

    private _getNode(nodeId: string) {
        return this.graph.nodesData.find(n => n.id === nodeId);
    }

    private _nodeLacksInputPorts(nodeId: string) {
        const node = this._getNode(nodeId);
        const nodeDefinition = NodeHandler.getById(node?.nodeId as string);
        return nodeDefinition?.getAllPortIds().length == 0;
    }

    private _nodeHasAllInputPortsResolved(nodeId: string) {
        const node = this._getNode(nodeId);
        const nodeDefinition = NodeHandler.getById(node?.nodeId as string);
        return nodeDefinition?.getAllPortIds().every(p => this.portValues[nodeId]?.[p]);
    }

    private _getNodeDefinition(nodeId: string) {
        const node = this._getNode(nodeId);
        return NodeHandler.getById(node?.nodeId as string);
    }

    // Invoke

    public async invoke(inputNode: string, portData: PortTriggerData<any>[], eventRef: GraphInputEvent) {
        try {
            await this.executionRecord.log('state-machine', `Invoking state machine execution ${this.executionRecord.id}`, {
                inputNode,
            });
            await this._evaluateStaticNodes();
            await this.executionRecord.log('state-machine', `Processed source event ${eventRef.type}, tracing results across graph`);
            await this._invoke(inputNode, portData);
            await this.executionRecord.log('state-machine', `Completed state machine execution ${this.executionRecord.id}`);
            await this.executionRecord.complete();
        } catch (error) {
            await this.executionRecord.error(
                'state-machine',
                `Failed to invoke state machine execution ${this.executionRecord.id}, error: ${error}, stack: ${
                    error instanceof Error ? error.stack : undefined
                }`
            );
            await this.executionRecord.fail();
        }
    }

    private async _invoke(inputNode: string, portData: PortTriggerData<any>[]) {
        Log.log('state-machine', `Consuming input node ${inputNode} and its port data for execution ${this.executionRecord.id}`);
        portData.forEach(p => this._setPortValue(inputNode, p.portId, p));
        await this._progressEvaluationQueue();
    }

    private async _evaluateStaticNodes() {
        Log.log('state-machine', `Evaluating static nodes for execution ${this.executionRecord.id}`);
        // Queue up all nodes that dont have any input ports
        const staticNodes = this.graph.nodesData.filter(n => this._getNodeDefinition(n.id).isStaticData());
        await this.executionRecord.log('state-machine', 'Evaluating all static nodes first before processing source event', {
            staticNodes,
        });
        for (const node of staticNodes) {
            const noInputPorts = this._nodeLacksInputPorts(node.id);
            if (noInputPorts) {
                this._addEvaluationQueue(node.id);
            }
        }
        // Evaluate all nodes in the queue and all nodes they connect to
        await this._progressEvaluationQueue();
        Log.log('state-machine', `Evaluated static nodes for execution ${this.executionRecord.id}`);
    }

    private async _progressEvaluationQueue() {
        if (this.evaluationQueue.length === 0) {
            Log.log('state-machine', `Evaluation queue is empty for execution ${this.executionRecord.id}, no more nodes to evaluate`);
            return;
        }
        const nodeId = this.evaluationQueue.shift();
        if (!nodeId) {
            return;
        }
        const node = this._getNode(nodeId);
        if (!node) {
            throw new Error(`Node ${nodeId} not found`);
        }
        this.invokeCount++;
        if (this.invokeCount > StateMachineExecution.maxInvokeCount) {
            throw new Error('Max invoke count reached');
        }

        Log.log('state-machine', `Invoking node ${nodeId} (${node.nodeId}) for execution ${this.executionRecord.id}`);
        Log.log('state-machine', `Queue now is [${[...this.evaluationQueue].join(', ')}] for execution ${this.executionRecord.id}`);

        try {
            // Get port data
            const ports = this._getPortDataForNode(nodeId);
            const portMap = this._getPortMap(ports);
            const definition = this._getNodeDefinition(nodeId);

            // Begin node resolution
            await this.executionRecord.log('state-machine', `Beginning node resolution for node ${nodeId} (${node.nodeId})`, {
                portMap,
            });

            // Resolve node
            const result = await this._resolveNode(nodeId, definition, ports);

            // Complete node resolution
            const outputMap = this._getPortMap(result.portData);
            await this.executionRecord.log('state-machine', `Completed node resolution for node ${nodeId} (${node.nodeId})`, {
                outputMap,
            });
        } catch (error) {
            Log.error(
                'state-machine',
                `Failed to resolve node ${nodeId} (${node.nodeId}) for execution ${this.executionRecord.id}, error: ${error}, stack: ${
                    error instanceof Error ? error.stack : undefined
                }`
            );
            await this.executionRecord.error(
                'state-machine',
                `Failed to resolve node ${nodeId} (${node.nodeId}) for execution ${this.executionRecord.id}, error: ${error}, stack: ${
                    error instanceof Error ? error.stack : undefined
                }`
            );
        }

        if (this.evaluationQueue.length > 0) {
            await this._progressEvaluationQueue();
        }
    }

    private async _resolveNode(nodeId: string, node: NodeHandler, portData: PortTriggerData<any>[]) {
        const result = await node.resolve({
            execution: this,
            node: node.getDefinition(),
            portData: portData,
            resolvePort: (id: string) => portData.find(p => p.portId === id)?.inputValue,
            parameters: this._getNode(nodeId)?.parameters ?? {},
            database: this.database,
        });
        result.portData.forEach(p => this._setPortValue(nodeId, p.portId, p));
        return result;
    }
}
