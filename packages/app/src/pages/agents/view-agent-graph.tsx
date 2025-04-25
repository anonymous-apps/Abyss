import { Background, BackgroundVariant, ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Bot } from 'lucide-react';
import React from 'react';
import { AgentNodeDrawer } from './graph-components/agent-node-drawer';
import { CustomAgentGraphNode } from './graph-components/custom-node';
import { useViewAgent } from './view-agent-graph.hook';

export function ViewAgentGraphPage() {
    const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodesDelete, handleAddNode, handleUpdateAgentName, agent } =
        useViewAgent();

    return (
        <ReactFlowProvider>
            <div className="flex w-full h-full">
                <div className="flex-1 h-full">
                    <div className="h-[54px] w-full  bg-[#0e0e0e] border-b border-background-600 py-2 border-l pl-4 flex items-center gap-2">
                        <Bot className="w-6 h-6 text-white" />
                        <input
                            value={agent.data?.name || ''}
                            onChange={e => handleUpdateAgentName(e.target.value)}
                            placeholder="My Amazing Agent"
                            className="w-[200px] bg-transparent text-text-100 p-2 pl-2 text-white focus:outline-none text-lg"
                        />
                    </div>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodesDelete={onNodesDelete}
                        fitView
                        proOptions={{ hideAttribution: true }}
                        nodeTypes={{ custom: CustomAgentGraphNode }}
                    >
                        <Background
                            variant={BackgroundVariant.Dots}
                            gap={12}
                            size={1}
                            className="bg-background-100"
                            style={{ stroke: 'var(--color-background-400)' }}
                        />
                    </ReactFlow>
                </div>
                <AgentNodeDrawer onAddNode={handleAddNode} />
            </div>
        </ReactFlowProvider>
    );
}
