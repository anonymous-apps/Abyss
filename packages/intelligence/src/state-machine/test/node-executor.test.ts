import { describe, expect, it } from 'vitest';
import { StateGraph } from '../../constructs/graphs/state-graph';
import { Nodes } from '../node-handlers';
import { StateMachineExecution } from '../state-machine-execution';

const node_debug_start = Nodes.DebugInput.getDefinition('debug-start');
const node_debug_log = Nodes.DebugLog.getDefinition('debug-log');

const debugGraph = new StateGraph();
debugGraph.addNode(node_debug_start);
debugGraph.addNode(node_debug_log);

debugGraph.addConnection({
    id: 'debug-start-to-log',
    sourceNodeId: 'debug-start',
    sourcePortId: 'output',
    targetNodeId: 'debug-log',
    targetPortId: 'logInput',
});

describe('node-executor', () => {
    it('should resolve a node', async () => {
        const execution = new StateMachineExecution('test', debugGraph);
        await execution.invoke(node_debug_start.id, []);
        console.dir(execution.getEvents(), { depth: null });
        expect(execution.getEvents()).toEqual([
            {
                executionId: 'test',
                type: 'execution-began',
            },
            {
                executionId: 'test',
                inputs: [],
                nodeId: 'debug-start',
                type: 'node-resolution-began',
            },
            {
                executionId: 'test',
                nodeId: 'debug-start',
                outputs: [
                    {
                        dataType: 'string',
                        inputValue: 'Hello, world!',
                        portId: 'output',
                    },
                ],
                type: 'node-resolution-completed',
            },
            {
                executionId: 'test',
                inputs: [
                    {
                        dataType: 'string',
                        inputValue: 'Hello, world!',
                        portId: 'logInput',
                    },
                ],
                nodeId: 'debug-log',
                type: 'node-resolution-began',
            },
            {
                executionId: 'test',
                nodeId: 'debug-log',
                outputs: [],
                type: 'node-resolution-completed',
            },
            {
                executionId: 'test',
                type: 'execution-completed',
            },
        ]);
    });
});
