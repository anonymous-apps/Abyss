import { GraphNodeDefinition } from '@abyss/intelligence';
import { Connection, Edge, addEdge, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Database } from '../../main';
import { useTableRecordAgent } from '../../state/database-connection';
import { RenderedGraphNode } from './graph-components/graph.types';

export function useViewAgent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const agent = useTableRecordAgent(id || '');

    const handleUpdateAgent = (data: Partial<typeof agent.data>) => {
        if (agent.data) {
            Database.table.agent.update(id || '', { ...agent.data, ...data });
        }
    };

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Agents', onClick: () => navigate('/agents') },
        { name: agent.data?.name || id || '', onClick: () => navigate(`/agents/id/${id}`) },
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState<RenderedGraphNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const handleAddNode = (node: GraphNodeDefinition) => {
        const newNode: RenderedGraphNode = {
            id: node.id,
            position: { x: 0, y: 0 },
            data: { label: node.name, definition: node },
            type: 'custom',
        };
        setNodes(nds => [...nds, newNode]);
    };

    const onConnect = useCallback(
        (connection: Connection) => {
            setEdges(eds => addEdge(connection, eds));
        },
        [setEdges]
    );

    // Handle node deletion
    const onNodesDelete = useCallback(
        (deletedNodes: RenderedGraphNode[]) => {
            // Clean up any edges connected to the deleted nodes
            const deletedNodeIds = new Set(deletedNodes.map(node => node.id));
            setEdges(edges => edges.filter(edge => !deletedNodeIds.has(edge.source) && !deletedNodeIds.has(edge.target)));
        },
        [setEdges]
    );

    const handleUpdateAgentName = (name: string) => {
        handleUpdateAgent({ name });
    };

    return {
        agent,
        breadcrumbs,
        handleUpdateAgent,
        navigate,
        handleAddNode,
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onNodesDelete,
        handleUpdateAgentName,
    };
}
