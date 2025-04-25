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

    // Convert XYFlow Edge format to AgentGraphRecord edge format
    // const convertToDbEdges = (flowEdges: Edge[]) => {
    //     return flowEdges.map(edge => ({
    //         id: edge.id,
    //         sourceNode: edge.source,
    //         sourceHandle: edge.sourceHandle || '',
    //         targetNode: edge.target,
    //         targetHandle: edge.targetHandle || '',
    //     }));
    // };

    // Convert AgentGraphRecord edge format to XYFlow Edge format
    const convertToFlowEdges = (dbEdges: any[]) => {
        return dbEdges.map(edge => ({
            id: edge.id,
            source: edge.sourceNode,
            sourceHandle: edge.sourceHandle,
            target: edge.targetNode,
            targetHandle: edge.targetHandle,
        }));
    };

    // // Create a debounced save function with 1 second delay
    // const saveGraphStateToDb = useCallback(
    //     debounce((currentNodes: RenderedGraphNode[], currentEdges: Edge[]) => {
    //         if (agent.data && id) {
    //             handleUpdateAgent({
    //                 graph: {
    //                     nodes: currentNodes,
    //                     edges: convertToDbEdges(currentEdges),
    //                 },
    //             });
    //         }
    //     }, 1000),
    //     [agent.data, id]
    // );

    // // Save graph state when nodes or edges change
    // useEffect(() => {
    //     saveGraphStateToDb(nodes, edges);
    // }, [nodes, edges, saveGraphStateToDb]);

    // Load saved graph state on initial load
    // useEffect(() => {
    //     if (agent.data?.graph?.nodes && agent.data?.graph?.edges) {
    //         setNodes(agent.data.graph.nodes as RenderedGraphNode[]);
    //         setEdges(convertToFlowEdges(agent.data.graph.edges));
    //     }
    // }, [agent.data?.graph, setNodes, setEdges]);

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
            const sourceNode = nodes.find(node => node.id === connection.source);
            const sourceHandleLocalId = connection.sourceHandle?.split(':')[1];
            const targetNode = nodes.find(node => node.id === connection.target);
            const targetHandleLocalId = connection.targetHandle?.split(':')[1];
            const sourceHandle =
                sourceNode?.data.definition.outputPorts[sourceHandleLocalId as keyof typeof sourceNode.data.definition.outputPorts];
            const targetHandle =
                targetNode?.data.definition.inputPorts[targetHandleLocalId as keyof typeof targetNode.data.definition.inputPorts];
            if (sourceHandle?.dataType !== targetHandle?.dataType) {
                console.error('Source and target handle types do not match:', sourceHandle, targetHandle);
                return;
            }
            const isTargetSignal = targetHandle?.type === 'signal';
            setEdges(eds =>
                addEdge(
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
                )
            );
        },
        [setEdges, nodes]
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
