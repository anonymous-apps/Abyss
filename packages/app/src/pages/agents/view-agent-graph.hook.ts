import { GraphNodeDefinition } from '@abyss/intelligence';
import { Connection, Edge, addEdge, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useEffect } from 'react';
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

    // Create a debounced save function with 1 second delay
    const saveGraphStateToDb = useCallback(
        (currentNodes: RenderedGraphNode[], currentEdges: Edge[]) => {
            if (agent.data && id) {
                handleUpdateAgent({
                    graph: {
                        nodes: currentNodes,
                        edges: currentEdges,
                    },
                });
                console.log('save');
            }
        },
        [agent.data, id]
    );

    useEffect(() => {
        if (agent.data && nodes.length === 0 && edges.length === 0) {
            setNodes(agent.data.graph.nodes as RenderedGraphNode[]);
            setEdges(agent.data.graph.edges);
        }
    }, [agent.data]);

    const handleAddNode = (node: GraphNodeDefinition) => {
        const newNode: RenderedGraphNode = {
            id: node.id,
            position: { x: 0, y: 0 },
            data: { label: node.name, definition: node },
            type: 'custom',
        };
        setNodes(nds => {
            const nodes = [...nds, newNode];
            return nodes;
        });
    };

    const onConnect = useCallback(
        (connection: Connection) => {
            const sourceNode = nodes.find(node => node.id === connection.source);
            const sourceHandleLocalId = connection.sourceHandle?.split(':')[1];
            const targetNode = nodes.find(node => node.id === connection.target);
            const targetHandleLocalId = connection.targetHandle?.split(':')[1];
            const sourceHandle =
                sourceNode?.data.definition.outputPorts[sourceHandleLocalId as keyof typeof sourceNode.data.definition.outputPorts];
            const targetHandle =
                targetNode?.data.definition.inputPorts[targetHandleLocalId as keyof typeof targetNode.data.definition.inputPorts];
            if (sourceHandle?.dataType !== targetHandle?.dataType) {
                console.error('Source and target handle types do not match:', {
                    sourceHandleId: sourceHandleLocalId,
                    sourceNode,
                    sourceHandle,
                    targetHandleId: targetHandleLocalId,
                    targetNode,
                    targetHandle,
                });
                return;
            }
            const isTargetSignal = targetHandle?.type === 'signal';
            setEdges(eds => {
                const newEdges = addEdge(
                    {
                        ...connection,
                        type: 'custom',
                        data: {
                            isSignal: isTargetSignal,
                            sourceHandle,
                            targetHandle,
                            targetColor: targetNode?.data.definition.color,
                        },
                    },
                    eds
                );
                return newEdges;
            });
        },
        [setEdges, nodes]
    );

    // Handle node deletion
    const onNodesDelete = useCallback(
        (deletedNodes: RenderedGraphNode[]) => {
            // Clean up any edges connected to the deleted nodes
            const deletedNodeIds = new Set(deletedNodes.map(node => node.id));
            setEdges(edges => {
                const newEdges = edges.filter(edge => !deletedNodeIds.has(edge.source) && !deletedNodeIds.has(edge.target));
                return newEdges;
            });
        },
        [setEdges, nodes]
    );

    useEffect(() => {
        saveGraphStateToDb(nodes, edges);
    }, [nodes, edges]);

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
