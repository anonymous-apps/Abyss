import { AgentGraphExecutionRecord, AgentGraphRecord, PrismaConnection } from '@abyss/records';
import { Log } from '../utils/logs';
import { NodeHandler } from './node-handler';
import './node-handlers';
import { PortTriggerData } from './type-base.type';

export class StateMachineExecution {
    private static maxInvokeCount = 100;
    private invokeCount = 0;

    // References
    private graph: AgentGraphRecord;
    private executionRecord: AgentGraphExecutionRecord;
    private database: PrismaConnection;

    // Execution
    private evaluationQueue: string[] = [];
    private portValues: Record<string, Record<string, PortTriggerData<any>>> = {};
    private staticNodesEvaluated: Set<string> = new Set();

    constructor(graph: AgentGraphRecord, executionRecord: AgentGraphExecutionRecord, database: PrismaConnection) {
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

    private _getConnectionOutofPort(nodeId: string, portId: string) {
        return this.graph.getConnection(nodeId, portId);
    }

    private _nodeLacksInputPorts(nodeId: string) {
        const node = this.graph.getNode(nodeId);
        const nodeDefinition = NodeHandler.getById(node?.nodeId as string);
        return nodeDefinition?.getAllPortIds().length == 0;
    }

    private _nodeHasAllInputPortsResolved(nodeId: string) {
        const node = this.graph.getNode(nodeId);
        const nodeDefinition = NodeHandler.getById(node?.nodeId as string);
        return nodeDefinition?.getAllPortIds().every(p => this.portValues[nodeId]?.[p]);
    }

    private _getNodeDefinition(nodeId: string) {
        const node = this.graph.getNode(nodeId);
        return NodeHandler.getById(node?.nodeId as string);
    }

    // Invoke

    public async invoke(inputNode: string, portData: PortTriggerData<any>[]) {
        try {
            Log.log('state-machine', `Invoking state machine execution ${this.executionRecord.id}`);
            await this.executionRecord.beginExecution();
            await this._evaluateStaticNodes();
            await this._invoke(inputNode, portData);
            await this.executionRecord.completeExecution();
        } catch (error) {
            Log.error(
                'state-machine',
                `Failed to invoke state machine execution ${this.executionRecord.id}, error: ${error}, stack: ${
                    error instanceof Error ? error.stack : undefined
                }`
            );
            await this.executionRecord.failExecution(
                error instanceof Error ? error.message : 'Unknown error',
                error instanceof Error ? error.stack : undefined
            );
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
        const staticNodes = this.graph.getNodes().filter(n => this._getNodeDefinition(n.id).isStaticData());
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
        const node = this.graph.getNode(nodeId);
        if (!node) {
            throw new Error(`Node ${nodeId} not found`);
        }
        this.invokeCount++;
        if (this.invokeCount > StateMachineExecution.maxInvokeCount) {
            throw new Error('Max invoke count reached');
        }

        Log.log('state-machine', `Invoking node ${nodeId} for execution ${this.executionRecord.id}`);
        Log.log('state-machine', `Queue now is [${[...this.evaluationQueue].join(', ')}] for execution ${this.executionRecord.id}`);

        try {
            // Get port data
            const ports = this._getPortDataForNode(nodeId);
            const portMap = this._getPortMap(ports);
            const definition = this._getNodeDefinition(nodeId);

            // Begin node resolution
            await this.executionRecord.beginNodeResolution(nodeId, node.nodeId, portMap);

            // Resolve node
            const result = await this._resolveNode(nodeId, definition, ports);

            // Complete node resolution
            const outputMap = this._getPortMap(result.portData);
            await this.executionRecord.completeNodeResolution(nodeId, node.nodeId, outputMap);
        } catch (error) {
            await this.executionRecord.failNodeResolution(
                nodeId,
                node.nodeId,
                error instanceof Error ? error.message : 'Unknown error',
                error instanceof Error ? error.stack : undefined
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
            parameters: this.graph.getNode(nodeId)?.parameters ?? {},
            database: this.database,
        });
        result.portData.forEach(p => this._setPortValue(nodeId, p.portId, p));
        return result;
    }
}
