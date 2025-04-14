import { ActionItem } from '@abyss/ui-components';
import { Bell, BinaryIcon, Bot, Box, Globe, Hammer, LucideIcon, MessageCircleQuestion, NotepadText, User } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDatabaseTableSubscription } from '../state/database-connection';

export interface RecordReference {
    icon: LucideIcon;
    label: string;
    link?: string;
}

export function getIconForSourceType(source: string): LucideIcon {
    switch (source.toLowerCase().split('::')[0]) {
        case 'ai':
        case 'chat':
        case 'chatmodel':
        case 'modelconnections':
            return Box;
        case 'agent':
            return Bot;
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

    if (recordType === 'user') {
        const Icon = getIconForSourceType('user');
        return {
            icon: Icon,
            label: 'You',
        };
    }

    if (recordType === 'modelconnections') {
        const Icon = getIconForSourceType('modelConnections');
        const data = useDatabaseTableSubscription('modelConnections', db => db.table.modelConnections.findById(sourceId));
        return {
            icon: Icon,
            label: data.data?.name || '',
            link: `/database/id/modelconnections/record/${sourceId}`,
        };
    }

    if (recordType === 'agent') {
        const Icon = getIconForSourceType('agent');
        const data = useDatabaseTableSubscription('agent', db => db.table.agent.findById(sourceId));
        return {
            icon: Icon,
            label: data.data?.name || '',
            link: `/database/id/agent/record/${sourceId}`,
        };
    }

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

    if (reference.responseStreamId) {
        actionItems.push({
            icon: BinaryIcon,
            tooltip: 'View Response Stream',
            onClick: () => navigate(`/database/id/responseStream/record/${reference.responseStreamId}`),
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
