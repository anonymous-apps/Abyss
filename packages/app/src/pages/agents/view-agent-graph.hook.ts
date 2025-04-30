import { Nodes } from '@abyss/intelligence';
import { GraphNodeDefinition } from '@abyss/intelligence/dist/state-machine/type-definition.type';
import { AgentGraphEdge, AgentGraphNode, AgentGraphRecord } from '@abyss/records';
import { Connection, Edge, addEdge, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Database } from '../../main';
import { useDatabaseRecord } from '../../state/database-connection';
import { RenderedGraphNode } from './graph-components/graph.types';

export function useViewAgent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const agent = useDatabaseRecord<AgentGraphRecord>('agentGraph', id || '');

    const handleUpdateAgent = (data: Partial<AgentGraphRecord>) => {
        if (agent) {
            Database.table.agentGraph.update(id || '', { ...agent, ...data });
        }
    };

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Agents', onClick: () => navigate('/agents') },
        { name: agent?.name || id || '', onClick: () => navigate(`/agents/id/${id}`) },
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState<RenderedGraphNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const dbToRenderedGraphNode = (node: AgentGraphNode): RenderedGraphNode => {
        const definition = Nodes[node.nodeId as keyof typeof Nodes].getDefinition();
        return {
            id: node.nodeId,
            type: 'custom',
            position: { x: node.position.x, y: node.position.y },
            data: { label: definition.name, definition: definition, database: node },
        };
    };

    const dbToRenderedGraphEdge = (edge: AgentGraphEdge): Edge => {
        return {
            id: edge.id,
            source: edge.sourceNodeId,
            sourceHandle: `${edge.sourceNodeId}:${edge.sourcePortId}`,
            target: edge.targetNodeId,
            targetHandle: `${edge.targetNodeId}:${edge.targetPortId}`,
        };
    };

    const renderedToDbNode = (node: RenderedGraphNode): AgentGraphNode => {
        return {
            id: node.data.database.id,
            nodeId: node.data.database.nodeId,
            parameters: node.data.database.parameters,
            position: node.position,
        };
    };

    const renderedToDbEdge = (edge: Edge): AgentGraphEdge => {
        const [sourceNodeId, sourcePortId] = edge.sourceHandle?.split(':') || [];
        const [targetNodeId, targetPortId] = edge.targetHandle?.split(':') || [];
        return {
            id: edge.id,
            sourceNodeId,
            sourcePortId,
            targetNodeId,
            targetPortId,
        };
    };

    // Create a debounced save function with 1 second delay
    const saveGraphStateToDb = useCallback(
        (currentNodes: RenderedGraphNode[], currentEdges: Edge[]) => {
            if (agent && id) {
                handleUpdateAgent({
                    nodes: currentNodes.map(renderedToDbNode),
                    edges: currentEdges.map(renderedToDbEdge),
                });
            }
        },
        [agent, id]
    );

    useEffect(() => {
        if (agent && nodes.length === 0 && edges.length === 0) {
            setNodes(agent.nodes.map(dbToRenderedGraphNode));
            setEdges(agent.edges.map(dbToRenderedGraphEdge));
        }
    }, [agent]);

    const handleAddNode = (node: GraphNodeDefinition) => {
        const newNode: RenderedGraphNode = {
            id: node.id,
            position: { x: 0, y: 0 },
            data: {
                label: node.name,
                definition: node,
                database: {
                    id: node.id,
                    nodeId: node.id,
                    parameters: {},
                    position: { x: 0, y: 0 },
                },
            },
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
