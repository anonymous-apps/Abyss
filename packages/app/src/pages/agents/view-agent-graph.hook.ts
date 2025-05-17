import { type GraphNodeDefinition, NodeHandler } from '@abyss/intelligence';
import type { AgentGraphEdge, AgentGraphNode, AgentGraphType } from '@abyss/records';
import { type Connection, type Edge, addEdge, useEdgesState, useNodesState } from '@xyflow/react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Database } from '../../main';
import { useDatabaseRecord } from '../../state/database-connection';
import type { RenderedGraphNode } from './graph-components/graph.types';

export function useViewAgent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const agent = useDatabaseRecord<AgentGraphType>('agentGraph', id || '');
    const [hasDoneInitialLoad, setHasDoneInitialLoad] = useState(false);

    const handleUpdateAgent = (data: Partial<AgentGraphType>) => {
        if (agent) {
            Database.tables.agentGraph.ref(id!).update(data);
        }
    };

    const breadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Agents', onClick: () => navigate('/agents') },
        { name: agent?.name || id || '', onClick: () => navigate(`/agents/id/${id}`) },
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState<RenderedGraphNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const dbToRenderedGraphNode = (node: AgentGraphNode): RenderedGraphNode | null => {
        if (!NodeHandler.getById(node.nodeId)) {
            console.error('Node handler not found for node:', node.nodeId);
            return null;
        }
        const definition = NodeHandler.getById(node.nodeId).getDefinition(node.id);
        return {
            id: node.id,
            type: 'custom',
            position: { x: node.position.x, y: node.position.y },
            data: { label: definition.name, definition: definition, database: node },
        };
    };

    const dbToRenderedGraphEdge = (edge: AgentGraphEdge, nodes: AgentGraphNode[]): Edge | null => {
        const targetNode = nodes.find(node => node.id === edge.targetNodeId);
        if (!targetNode) {
            console.error('Target node not found for edge:', edge);
            return null;
        }
        const definition = NodeHandler.getById(targetNode?.nodeId!);
        if (!definition) {
            console.error('Definition not found for edge:', edge);
            return null;
        }
        const isSignal = definition.isSignalPort(edge.targetPortId);

        return {
            id: edge.id,
            source: edge.sourceNodeId,
            sourceHandle: edge.sourcePortId,
            target: edge.targetNodeId,
            targetHandle: edge.targetPortId,
            type: 'custom',
            data: {
                isSignal,
                targetColor: definition.getDefinition().color,
            },
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
        return {
            id: edge.id,
            sourceNodeId: edge.source,
            sourcePortId: edge.sourceHandle || '',
            targetNodeId: edge.target,
            targetPortId: edge.targetHandle || '',
        };
    };

    // Create a debounced save function with 1 second delay
    const saveGraphStateToDb = useCallback(
        (currentNodes: RenderedGraphNode[], currentEdges: Edge[]) => {
            if (agent && id) {
                handleUpdateAgent({
                    nodesData: currentNodes.map(renderedToDbNode),
                    edgesData: currentEdges.map(renderedToDbEdge),
                });
            }
        },
        [agent, id]
    );

    useEffect(() => {
        if (agent && nodes.length === 0 && edges.length === 0 && !hasDoneInitialLoad) {
            setNodes(agent.nodesData.map(node => dbToRenderedGraphNode(node)).filter(node => node !== null) as RenderedGraphNode[]);
            setEdges(agent.edgesData.map(edge => dbToRenderedGraphEdge(edge, agent.nodesData)).filter(edge => edge !== null) as Edge[]);
            setHasDoneInitialLoad(true);
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
                    nodeId: node.type,
                    position: { x: 0, y: 0 },
                    parameters: {},
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
            const sourceHandleLocalId = connection.sourceHandle;
            const targetNode = nodes.find(node => node.id === connection.target);
            const targetHandleLocalId = connection.targetHandle;
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
