import { GraphNodeDefinition, Nodes } from '@abyss/intelligence';
import { Sidebar, SidebarButton, SidebarSection } from '@abyss/ui-components';
import { MessageCircle } from 'lucide-react';
import React from 'react';

interface AgentNodeDrawerProps {
    onAddNode: (node: GraphNodeDefinition) => void;
}

export function AgentNodeDrawer({ onAddNode }: AgentNodeDrawerProps) {
    return (
        <div className="flex flex-row overflow-hidden h-[100vh]">
            <Sidebar className="bg-[#0e0e0e]" title="Agent nodes" width={300}>
                <SidebarSection title="Events" />
                <SidebarButton
                    label="On Chat Message"
                    icon={MessageCircle}
                    onClick={() => onAddNode(Nodes.OnChatMessage.getDefinition())}
                />
            </Sidebar>
        </div>
    );
}
