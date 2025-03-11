import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Box, DatabaseIcon, MessageSquare, Play, Settings, type LucideIcon } from 'lucide-react';
import { useSidebarFadeStore } from '../../state/sidebar-fade';

export interface SidebarItemProps {
    title: string;
    icon: LucideIcon;
    url: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ title, icon: Icon, url }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(url);

    return (
        <Link
            to={url}
            className={`relative flex items-center gap-2 px-2 py-1 transition-colors text-xs ${
                isActive
                    ? 'bg-primary-base text-text-light'
                    : 'pacity-70 hover:opacity-100 hover:bg-primary-950 hover:text-text-200 hover:bg-background-dark '
            }`}
        >
            <Icon size={16} className="min-w-[16px]" />
            <span>{title}</span>
        </Link>
    );
};

interface SidebarSectionProps {
    title: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title }) => {
    return (
        <div className="flex flex-col gap-1">
            <div className="text-text-500 text-xs rounded-sm py-1 mt-5 mb-1 px-2 opacity-50">{title}</div>
        </div>
    );
};

export function Sidebar() {
    const { sidebarFadeable, setSidebarFadeable } = useSidebarFadeStore();
    const [opacity, setOpacity] = React.useState(sidebarFadeable ? 0 : 1);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setOpacity(1);
            setSidebarFadeable(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className="relative left-0 top-0 h-screen flex flex-col pt-5 min-w-[150px] bg-background-dark transition-opacity duration-300 text-text-light"
            style={{ opacity }}
        >
            <SidebarSection title="Activity" />
            <SidebarItem title="Chats" icon={MessageSquare} url="/chats" />
            <SidebarSection title="Configuration" />
            <SidebarItem title="Models" icon={Box} url="/model-connection" />
            <SidebarItem title="Actions" icon={Play} url="/actions" />
            <SidebarItem title="Storage" icon={DatabaseIcon} url="/database" />
            <SidebarItem title="Settings" icon={Settings} url="/settings" />
        </div>
    );
}

interface WithSidebarProps {
    children: React.ReactNode;
}

export function WithSidebar({ children }: WithSidebarProps) {
    return (
        <div className="flex flex-row text-text-base max-h-[100vh]">
            <Sidebar />
            <div className="w-full h-[100vh] overflow-y-auto">{children}</div>
        </div>
    );
}
