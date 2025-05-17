import { beforeEach, describe, expect, test } from 'vitest';
import type { SQliteClient } from '../../sqlite/sqlite-client';
import { buildCleanDB } from '../../sqlite/sqlite-client.mock';
import type { ReferencedAgentGraphRecord } from './agent-graph';
import type { AgentGraphEdge, AgentGraphNode, AgentGraphType } from './agent-graph.type';

let client: SQliteClient;

beforeEach(async () => {
    client = await buildCleanDB();
});

describe('Agent Graph Table', () => {
    test('we can get a agent graph referance by id', async () => {
        const newGraph = await client.tables.agentGraph.create({
            name: 'Test Graph',
            description: 'A test agent graph',
            nodesData: [],
            edgesData: [],
        });
        const ref = client.tables.agentGraph.ref(newGraph.id);
        const retrievedGraph = await ref.get();
        expect(retrievedGraph).toBeDefined();
        expect(retrievedGraph.id).toEqual(newGraph.id);
    });
});

describe('Agent Graph Record', () => {
    let graph: AgentGraphType;
    let graphRef: ReferencedAgentGraphRecord;

    beforeEach(async () => {
        graph = await client.tables.agentGraph.create({
            name: 'Test Graph Record',
            description: 'A graph for testing record operations',
            nodesData: [],
            edgesData: [],
        });
        graphRef = client.tables.agentGraph.ref(graph.id);
    });

    test('we can set the node parameters', async () => {
        const nodeIdInGraph = 'graphNode1';
        const actualNodeId = 'definedNodeId1';
        const initialNode: AgentGraphNode = {
            id: nodeIdInGraph,
            nodeId: actualNodeId,
            parameters: { text: 'initial' },
            position: { x: 0, y: 0 },
        };
        await graphRef.setNodes([initialNode]);

        const newParameters = { text: 'updated text' };
        await graphRef.setNodeParameters(nodeIdInGraph, newParameters);

        const updatedGraph = await graphRef.get();
        const updatedNode = updatedGraph.nodesData.find((n: AgentGraphNode) => n.id === nodeIdInGraph);
        expect(updatedNode?.parameters).toEqual(newParameters);
    });

    test('we can set the node position', async () => {
        const nodeIdInGraph = 'graphNode1';
        const actualNodeId = 'definedNodeId1';
        const initialNode: AgentGraphNode = {
            id: nodeIdInGraph,
            nodeId: actualNodeId,
            parameters: { text: 'initial' },
            position: { x: 0, y: 0 },
        };
        await graphRef.setNodes([initialNode]);

        const newPosition = { x: 100, y: 200 };
        await graphRef.setNodePosition(nodeIdInGraph, newPosition);

        const updatedGraph = await graphRef.get();
        const updatedNode = updatedGraph.nodesData.find((n: AgentGraphNode) => n.id === nodeIdInGraph);
        expect(updatedNode?.position).toEqual(newPosition);
    });

    test('we can set the nodes', async () => {
        const nodes: AgentGraphNode[] = [
            { id: 'graphNode1', nodeId: 'definedNodeId1', parameters: { text: 'Node 1' }, position: { x: 0, y: 0 } },
            { id: 'graphNode2', nodeId: 'definedNodeId2', parameters: { text: 'Node 2' }, position: { x: 10, y: 10 } },
        ];
        await graphRef.setNodes(nodes);
        const updatedGraph = await graphRef.get();
        expect(updatedGraph.nodesData).toEqual(nodes);
    });

    test('we can set the connections', async () => {
        const node1: AgentGraphNode = { id: 'gNode1', nodeId: 'defNode1', parameters: {}, position: { x: 0, y: 0 } };
        const node2: AgentGraphNode = { id: 'gNode2', nodeId: 'defNode2', parameters: {}, position: { x: 0, y: 0 } };
        await graphRef.setNodes([node1, node2]);

        const connections: AgentGraphEdge[] = [
            { id: 'conn1', sourceNodeId: 'gNode1', sourcePortId: 'out', targetNodeId: 'gNode2', targetPortId: 'in' },
        ];
        await graphRef.setConnections(connections);
        const updatedGraph = await graphRef.get();
        expect(updatedGraph.edgesData).toEqual(connections);
    });
});
