import { useLocation, useNavigate } from 'react-router-dom';
import { getIconForSourceType } from '../../library/references';
import { Database } from '../../main';
import { useScanTableChats } from '../../state/database-access-utils';

export function useChatMain() {
    const chats = useScanTableChats();
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
        Database.table.chatThread.delete(chatId);
    };

    const sidebarItems = (chats.data || []).map(entry => {
        return {
            id: entry.id,
            title: entry.name,
            icon: getIconForSourceType(entry.participantId),
            url: `/chats/id/${entry.id}`,
            onCancel: () => handleDeleteChat(entry.id),
        };
    });

    return {
        sidebarItems,
        handleCreateChat,
        handleDeleteChat,
    };
}
