import { Button, Sidebar, SidebarButton } from '@abyss/ui-components';
import { Plus } from 'lucide-react';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useChatMain } from './main.hook';

export function ChatMainPage() {
    const { sidebarItems, handleCreateChat, handleDeleteChat } = useChatMain();
    const navigate = useNavigate();

    return (
        <div className="flex flex-row overflow-hidden h-[100vh]">
            <Sidebar
                className="bg-[#0e0e0e]"
                title="chats"
                titleAction={<Button variant="secondary" icon={Plus} onClick={handleCreateChat} />}
                width={300}
            >
                {sidebarItems.map(item => (
                    <SidebarButton
                        key={item.id}
                        label={item.title}
                        icon={item.icon}
                        onClick={() => navigate(item.url)}
                        isActive={location.pathname === item.url}
                        isClosable={true}
                        onClose={() => handleDeleteChat(item.id)}
                    />
                ))}
                {sidebarItems.length === 0 && <div className="text-center text-sm text-gray-500 mt-4">Chats will appear here</div>}
            </Sidebar>
            <div className="w-full h-full overflow-y-auto bg-background-transparent">
                <Outlet />
            </div>
        </div>
    );
}
