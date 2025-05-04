import { describe, expect, test } from 'vitest';
import { buildCleanDB } from '../../sqlite/sqlite-client.test';

describe('AgentGraph::create', () => {
    test('Happy: Create agent graph record', async () => {
        const client = await buildCleanDB();
        const agentGraph = await client.tables.agentGraph.create({
            id: 'agent-graph::test',
            name: 'Test Agent Graph',
            description: 'A test agent graph',
            nodesData: [
                {
                    id: 'node::test',
                    nodeId: 'node-type::test',
                    position: {
                        x: 0,
                        y: 0,
                    },
                    parameters: {},
                },
            ],
            edgesData: [],
        });
        expect(agentGraph).toBeDefined();
        expect(agentGraph.id).toBe('agent-graph::test');
    });
});
