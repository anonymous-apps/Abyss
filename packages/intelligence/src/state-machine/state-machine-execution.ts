import { AgentGraphExecutionRecord, AgentGraphRecord } from '@abyss/records';
import { NodeHandler } from './node-handler';
import './node-handlers';
import { Nodes } from './node-handlers';
import { PortTriggerData } from './type-base.type';

export class StateMachineExecution {
    private static maxInvokeCount = 100;
    private invokeCount = 0;

    // References
    private graph: AgentGraphRecord;
    private executionRecord: AgentGraphExecutionRecord;

    // Execution
    private evaluationQueue: string[] = [];
    private portValues: Record<string, Record<string, PortTriggerData<any>>> = {};
    private staticNodesEvaluated: Set<string> = new Set();

    constructor(graph: AgentGraphRecord, executionRecord: AgentGraphExecutionRecord) {
        this.graph = graph;
        this.executionRecord = executionRecord;
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

    private _getPortMap(portData: PortTriggerData<any>[]) {
        return portData.reduce((acc, p) => {
            acc[p.portId] = p.inputValue;
            return acc;
        }, {} as Record<string, any>);
    }

    private _getConnectionOutofPort(nodeId: string, portId: string) {
        return this.graph.getConnection(nodeId, portId);
    }

    private _doesNodeHaveAllPortsResolved(nodeId: string) {
        const node = this.graph.getNode(nodeId);
        const nodeDefinition = Nodes[node?.nodeId as keyof typeof Nodes];
        return nodeDefinition?.getAllPortIds().every(p => this.portValues[nodeId]?.[p]);
    }

    private _getNodeDefinition(nodeId: string) {
        const node = this.graph.getNode(nodeId);
        return Nodes[node?.nodeId as keyof typeof Nodes];
    }

    // Invoke

    public async invoke(inputNode: string, portData: PortTriggerData<any>[]) {
        try {
            await this.executionRecord.beginExecution();
            await this._evaluateStaticNodes();
            await this._invoke(inputNode, portData);
            await this.executionRecord.completeExecution();
        } catch (error) {
            await this.executionRecord.failExecution(
                error instanceof Error ? error.message : 'Unknown error',
                error instanceof Error ? error.stack : undefined
            );
        }
    }

    private async _evaluateStaticNodes() {
        const staticNodes = this.graph.getNodes().filter(n => this._getNodeDefinition(n.id).isStaticData());
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
        });
        result.portData.forEach(p => this._setPortValue(nodeId, p.portId, p));
        return result;
    }
}
