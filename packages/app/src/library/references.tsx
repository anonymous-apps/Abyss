import { ActionItem } from '@abyss/ui-components';
import { Bell, BinaryIcon, Bot, Box, Cog, Globe, Hammer, LucideIcon, MessageCircleQuestion, NotepadText, User } from 'lucide-react';
import { useNavigate } from 'react-router';

export interface RecordReference {
    icon: LucideIcon;
    label: string;
    link?: string;
}

export function getIconForSourceType(source: string): LucideIcon {
    switch (source.toLowerCase().split('::')[0]) {
        case 'system':
            return Cog;
        case 'modelconnection':
            return Box;
        case 'agentgraph':
            return Bot;
        case 'human':
        case 'user':
            return User;
        case 'internal':
            return Bell;
        case 'tool':
            return Hammer;
        default:
            return MessageCircleQuestion;
    }
}

export function useRecordReference({ sourceId }: { sourceId: string }): RecordReference {
    const recordType = sourceId.toLowerCase().split('::')[0];

    if (recordType === 'human') {
        const Icon = getIconForSourceType('user');
        return {
            icon: Icon,
            label: 'You',
        };
    }

    if (recordType === 'system') {
        const Icon = getIconForSourceType('system');
        return {
            icon: Icon,
            label: 'System',
        };
    }

    if (recordType === 'modelconnection') {
        const Icon = getIconForSourceType('modelconnection');
        return {
            icon: Icon,
            label: 'Model Connection',
            link: `/database/id/modelConnection/record/${sourceId}`,
        };
    }

    if (recordType === 'agentgraph') {
        const Icon = getIconForSourceType('agentgraph');
        return {
            icon: Icon,
            label: 'Agent Graph',
            link: `/database/id/agentGraph/record/${sourceId}`,
        };
    }

    console.warn('Unknown record type', recordType);

    return {
        icon: MessageCircleQuestion,
        label: 'Unknown',
    };
}

export function useActionItems({ references }: { references?: Record<string, string | undefined> }) {
    const navigate = useNavigate();
    const actionItems: ActionItem[] = [];
    const reference = references ?? {};

    if (reference.networkCallId) {
        actionItems.push({
            icon: Globe,
            tooltip: 'View API call',
            onClick: () => navigate(`/database/id/networkCall/record/${reference.networkCallId}`),
        });
    }

    if (reference.renderedConversationThreadId) {
        actionItems.push({
            icon: NotepadText,
            tooltip: 'View conversation snapshot',
            onClick: () => navigate(`/database/id/renderedConversationThread/record/${reference.renderedConversationThreadId}`),
        });
    }

    if (reference.modelInvokeId) {
        actionItems.push({
            icon: BinaryIcon,
            tooltip: 'View Model Invoke',
            onClick: () => navigate(`/database/id/modelInvoke/record/${reference.modelInvokeId}`),
        });
    }

    if (reference.toolSourceId) {
        actionItems.push({
            icon: Hammer,
            tooltip: 'View Tool',
            onClick: () => navigate(`/database/id/tool/record/${reference.toolSourceId}`),
        });
    }

    return actionItems;
}
