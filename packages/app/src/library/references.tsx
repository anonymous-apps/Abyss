import { Bell, Bot, Box, Hammer, LucideIcon, MessageCircleQuestion, User } from 'lucide-react';
import React from 'react';
import { useDatabaseTableSubscription } from '../state/database-connection';

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

export function ReferencedObject({ sourceId }: { sourceId: string }) {
    const recordType = sourceId.toLowerCase().split('::')[0];

    if (recordType === 'user') {
        return <ReferencedObjectYou />;
    }

    if (recordType === 'modelconnections') {
        return <ReferencedObjectModel modelConnectionId={sourceId} />;
    }

    if (recordType === 'agent') {
        return <ReferencedObjectAgent agentId={sourceId} />;
    }

    return <>?</>;
}

export function ReferencedObjectYou() {
    const Icon = getIconForSourceType('user');
    return (
        <div className="flex items-center gap-2">
            <Icon size={14} />
            <span>You</span>
        </div>
    );
}

export function ReferencedObjectModel({ modelConnectionId }: { modelConnectionId: string }) {
    const data = useDatabaseTableSubscription('modelConnections', db => db.table.modelConnections.findById(modelConnectionId));
    const Icon = getIconForSourceType('modelConnections');

    return (
        <div className="flex items-center gap-2">
            <Icon size={14} className="" />
            <span>{data.data?.name}</span>
        </div>
    );
}

export function ReferencedObjectAgent({ agentId }: { agentId: string }) {
    const data = useDatabaseTableSubscription('agent', db => db.table.agent.findById(agentId));
    const Icon = getIconForSourceType('agent');

    return (
        <div className="flex items-center gap-2">
            <Icon size={14} />
            <span>{data.data?.name}</span>
        </div>
    );
}
