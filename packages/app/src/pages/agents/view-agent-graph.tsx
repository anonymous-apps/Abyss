import { GraphNodeDefinition, Nodes } from '@abyss/intelligence';
import {
    Background,
    BackgroundVariant,
    Connection,
    Edge,
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useEdgesState,
    useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useCallback, useEffect } from 'react';
import { AgentNodeDrawer } from './graph-components/agent-node-drawer';
import { CustomAgentGraphNode } from './graph-components/custom-node';
import { RenderedGraphNode } from './graph-components/graph.types';

export function ViewAgentGraphPage() {
    // Use ReactFlow hooks for controlled node and edge state
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
            console.log('onConnect', connection);
            setEdges(eds => addEdge(connection, eds));
        },
        [setEdges]
    );

    useEffect(() => {
        handleAddNode(Nodes.OnChatMessage.getDefinition());
    }, []);

    return (
        <ReactFlowProvider>
            <div className="flex w-full h-full">
                <AgentNodeDrawer onAddNode={handleAddNode} />
                <div className="flex-1 h-full">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                        proOptions={{ hideAttribution: true }}
                        nodeTypes={{ custom: CustomAgentGraphNode }}
                    >
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} className="bg-background-100" />
                    </ReactFlow>
                </div>
            </div>
        </ReactFlowProvider>
    );
}
