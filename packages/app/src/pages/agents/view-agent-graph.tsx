import { GraphNodeDefinition } from '@abyss/intelligence';
import { Background, BackgroundVariant, ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useState } from 'react';
import { AgentNodeDrawer } from './graph-components/agent-node-drawer';
import { RenderedGraphNode } from './graph-components/graph.types';

export function ViewAgentGraphPage() {
    const [nodes, setNodes] = useState<Record<string, RenderedGraphNode>>({});

    const handleAddNode = (node: GraphNodeDefinition) => {
        setNodes(prev => ({
            ...prev,
            [node.id]: {
                id: node.id,
                definition: node,
                position: { x: 0, y: 0 },
                data: { label: node.name },
            },
        }));
    };

    return (
        <div className="w-full h-full ">
            <AgentNodeDrawer onAddNode={handleAddNode} />
            <ReactFlowProvider>
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} className="bg-background-100" />
                <ReactFlow nodes={Object.values(nodes)} edges={[]} proOptions={{ hideAttribution: true }} />
            </ReactFlowProvider>
        </div>
    );
}
