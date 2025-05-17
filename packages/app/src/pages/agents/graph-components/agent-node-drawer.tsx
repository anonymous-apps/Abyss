import { Nodes } from '@abyss/intelligence';
import type { GraphNodeDefinition } from '@abyss/intelligence/dist/state-machine/type-definition.type';
import { Sidebar, SidebarButton, SidebarSection } from '@abyss/ui-components';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';

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
                <SidebarSection title="Constants" />
                <SidebarButton
                    label="Input String"
                    icon={ArrowRight}
                    onClick={() => onAddNode(Nodes.InputConstantString.getDefinition())}
                />
                <SidebarSection title="AI" />
                <SidebarButton
                    label="Input Language Model"
                    icon={ArrowRight}
                    onClick={() => onAddNode(Nodes.InputLanguageModel.getDefinition())}
                />
                <SidebarButton
                    label="Invoke Language Model"
                    icon={Sparkles}
                    onClick={() => onAddNode(Nodes.InvokeLanguageModel.getDefinition())}
                />
                <SidebarSection title="Tools" />
                <SidebarButton label="Input Tools" icon={ArrowRight} onClick={() => onAddNode(Nodes.InputToolsSelection.getDefinition())} />
                <SidebarButton
                    label="Add Tools to Thread"
                    icon={MessageCircle}
                    onClick={() => onAddNode(Nodes.AddToolsToThread.getDefinition())}
                />
                <SidebarSection title="Chats" />
                <SidebarButton
                    label="Write Agent Message"
                    icon={MessageCircle}
                    onClick={() => onAddNode(Nodes.WriteAgentMessage.getDefinition())}
                />
                <SidebarButton
                    label="Write User Message"
                    icon={MessageCircle}
                    onClick={() => onAddNode(Nodes.WriteUserMessage.getDefinition())}
                />
            </Sidebar>
        </div>
    );
}
