import { Plus } from 'lucide-react';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getIconForSourceType } from '../../library/icons';
import { GhostIconButton } from '../../library/input/button';
import { PageSidebar } from '../../library/layout/page-sidebar';
import { useScanTableChat } from '../../state/database-connection';

export function ChatMainPage() {
    const chats = useScanTableChat();
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
        icon: getIconForSourceType(entry.type || ''),
        url: `/chats/id/${entry.id}`,
    }));

    return (
        <PageSidebar header={createChatHeader} items={builtSidebar}>
            <Outlet />
        </PageSidebar>
    );
}
