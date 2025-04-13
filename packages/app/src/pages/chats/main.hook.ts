import { useLocation, useNavigate } from 'react-router-dom';
import { getIconForSourceType } from '../../library/references';
import { Database } from '../../main';
import { useScanTableChat, useScanTableMessageThread } from '../../state/database-connection';

export function useChatMain() {
    const chats = useScanTableChat();
    const threads = useScanTableMessageThread();
    const location = useLocation();
    const navigate = useNavigate();

    // Redirect to create page if on the base chats path
    if (location.pathname === '/chats') {
        setTimeout(() => navigate('/chats/create'));
    }

    const handleCreateChat = () => {
        navigate('/chats/create');
    };

    const handleDeleteChat = (chatId: string) => {
        Database.table.chat.delete(chatId);
    };

    const sidebarItems = (chats.data || []).map(entry => {
        const activeStream = threads.data?.find(t => t.id === entry.threadId)?.lockingId?.length;

        return {
            title: entry.name,
            icon: getIconForSourceType(entry.references?.sourceId || ''),
            url: `/chats/id/${entry.id}`,
            status: activeStream ? 'in-progress' : undefined,
            onCancel: () => handleDeleteChat(entry.id),
        };
    });

    return {
        sidebarItems,
        handleCreateChat,
    };
}
