import { GraphNodeDefinition } from '@abyss/intelligence';
import { Background, BackgroundVariant, Edge, Node, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React from 'react';
import { AgentNodeDrawer } from './graph-components/agent-node-drawer';

export function ViewAgentGraphPage() {
    // Use ReactFlow hooks for controlled node and edge state
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const handleAddNode = (node: GraphNodeDefinition) => {
        const newNode = {
            id: node.id,
            position: { x: 0, y: 0 },
            data: { label: node.name },
            // add type or other properties if needed
        };
        setNodes(nds => [...nds, newNode]);
    };

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
                        fitView
                        proOptions={{ hideAttribution: true }}
                    >
                        <Background variant={BackgroundVariant.Dots} gap={12} size={1} className="bg-background-100" />
                    </ReactFlow>
                </div>
            </div>
        </ReactFlowProvider>
    );
}
