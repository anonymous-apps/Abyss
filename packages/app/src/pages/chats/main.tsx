import { Box, MessageSquare, Plus } from 'lucide-react';
import React from 'react';
import { PageSidebar } from '../../library/layout/page-sidebar';
import { Outlet, redirect, useLocation, useNavigate } from 'react-router-dom';
import { useDatabaseRecordSubscription, useDatabaseTableSubscription } from '../../state/database-connection';
import { GhostIconButton } from '../../library/input/button';

export function ChatMainPage() {
    const chats = useDatabaseTableSubscription('Chat', database => database.table.chat.scanTable());
    const location = useLocation();
    const navigate = useNavigate();

    const createChatHeader = (
        <div className="flex flex-row items-center justify-between border-b border-background-light p-1">
            <div className="text-sm rounded-sm mt-2 mb-1 px-2">Chats</div>
            <GhostIconButton icon={Plus} onClick={() => navigate('/chats/create')} />
        </div>
    );

    if (location.pathname === '/chats') {
        setTimeout(() => navigate('/chats/create'));
    }

    const builtSidebar = (chats.data || []).map(entry => ({
        title: entry.name,
        icon: MessageSquare,
        url: `/chats/id/${entry.id}`,
    }));

    return (
        <PageSidebar header={createChatHeader} items={builtSidebar}>
            <Outlet />
        </PageSidebar>
    );
}

export default ChatMainPage;
