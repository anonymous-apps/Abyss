import { Plus } from 'lucide-react';
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getIconForSourceType } from '../../library/content/record-references';
import { GhostIconButton } from '../../library/input/button';
import { PageSidebar } from '../../library/layout/page-sidebar';
import { Database } from '../../main';
import { useScanTableChat, useScanTableMessageThread } from '../../state/database-connection';

export function ChatMainPage() {
    const chats = useScanTableChat();
    const threads = useScanTableMessageThread();
    const location = useLocation();
    const navigate = useNavigate();

    const createChatHeader = (
        <div className="flex flex-row items-center justify-between border-b border-background-100 p-1">
            <div className="text-sm rounded-sm mt-2 mb-1 px-2">Chats</div>
            <GhostIconButton icon={Plus} onClick={() => navigate('/chats/create')} />
        </div>
    );

    if (location.pathname === '/chats') {
        setTimeout(() => navigate('/chats/create'));
    }

    const builtSidebar = (chats.data || []).map((entry, index) => {
        const activeStream = threads.data?.find(t => t.id === entry.threadId)?.lockingId?.length;
        const onDelete = () => {
            Database.table.chat.delete(entry.id);
        };

        return {
            title: entry.name,
            icon: getIconForSourceType(entry.references?.sourceId || ''),
            url: `/chats/id/${entry.id}`,
            status: activeStream ? 'in-progress' : undefined,
            onCancel: onDelete,
        };
    });

    return (
        <PageSidebar header={createChatHeader} items={builtSidebar}>
            <Outlet />
        </PageSidebar>
    );
}
