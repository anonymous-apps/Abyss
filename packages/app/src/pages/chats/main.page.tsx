import { Button } from '@abyss/ui-components';
import { Plus } from 'lucide-react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { PageSidebar } from '../../library/layout/page-sidebar';
import { useChatMain } from './main.hook';

export function ChatMainPage() {
    const { sidebarItems, handleCreateChat } = useChatMain();

    const createChatHeader = (
        <div className="flex flex-row items-center justify-between border-b border-background-100 p-1">
            <div className="text-sm rounded-sm mt-2 mb-1 px-2">Chats</div>
            <Button icon={Plus} onClick={handleCreateChat} />
        </div>
    );

    return (
        <PageSidebar header={createChatHeader} items={sidebarItems}>
            <Outlet />
        </PageSidebar>
    );
}
