import { GraphNodeDefinition, Nodes } from '@abyss/intelligence';
import { Sidebar, SidebarButton, SidebarSection } from '@abyss/ui-components';
import { Box, MessageCircle, Sparkles } from 'lucide-react';
import React from 'react';

interface AgentNodeDrawerProps {
    onAddNode: (node: GraphNodeDefinition) => void;
}

export function AgentNodeDrawer({ onAddNode }: AgentNodeDrawerProps) {
    return (
        <div className="flex flex-row overflow-hidden h-[100vh]">
            <Sidebar className="bg-[#0e0e0e] border-l border-background-600" title="Agent nodes" width={300}>
                <SidebarSection title="Events" />
                <SidebarButton
                    label="On Chat Message"
                    icon={MessageCircle}
                    onClick={() => onAddNode(Nodes.OnChatMessage.getDefinition())}
                />
                <SidebarSection title="References" />
                <SidebarButton label="Language Model" icon={Box} onClick={() => onAddNode(Nodes.InputLanguageModel.getDefinition())} />
                <SidebarSection title="Actions" />
                <SidebarButton
                    label="Invoke Language Model"
                    icon={Sparkles}
                    onClick={() => onAddNode(Nodes.InvokeLanguageModel.getDefinition())}
                />
                <SidebarButton
                    label="Write Chat Message"
                    icon={MessageCircle}
                    onClick={() => onAddNode(Nodes.WriteChatMessage.getDefinition())}
                />
            </Sidebar>
        </div>
    );
}
