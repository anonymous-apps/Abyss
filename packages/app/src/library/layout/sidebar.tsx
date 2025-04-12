import { Bot, Box, ChartLine, DatabaseIcon, Loader2, MessageSquare, Play, Settings, X, type LucideIcon } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSidebarFadeStore } from '../../state/sidebar-fade';

export interface SidebarItemProps {
    title: string;
    icon: LucideIcon;
    url: string;
    status?: string;
    onCancel?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ title, icon: Icon, url, status, onCancel }) => {
    const location = useLocation();
    const isActive = location.pathname.startsWith(url);
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <Link
            to={url}
            className={`relative flex items-center gap-2 px-2 py-1 transition-colors text-xs text-text-300 ${
                isActive ? 'bg-primary-300' : 'pacity-70 hover:opacity-100 hover:bg-background-transparent '
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Icon size={16} className="min-w-[16px]" />
            <span>{title}</span>
            {status === 'in-progress' && !isHovered && (
                <div className="ml-auto text-xs ">
                    <Loader2 size={12} className="animate-spin" />
                </div>
            )}
            {isHovered && onCancel && (
                <div
                    className="ml-auto text-xs"
                    onClick={e => {
                        e.preventDefault();
                        onCancel();
                    }}
                >
                    <X size={12} />
                </div>
            )}
        </Link>
    );
};

interface SidebarSectionProps {
    title: string;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ title }) => {
    return (
        <div className="flex flex-col gap-1">
            <div className="text-text-sidebar text-xs rounded-sm py-1 mt-5 mb-1 px-2 opacity-50">{title}</div>
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
            className="relative left-0 top-0 h-screen flex flex-col pt-5 min-w-[150px] transition-opacity duration-300"
            style={{ opacity }}
        >
            <SidebarSection title="Activity" />
            <SidebarItem title="Chats" icon={MessageSquare} url="/chats" />
            <SidebarSection title="Configuration" />
            <SidebarItem title="Models" icon={Box} url="/models" />
            <SidebarItem title="Agents" icon={Bot} url="/agents" />
            <SidebarItem title="Tools" icon={Play} url="/tools" />
            <SidebarItem title="Settings" icon={Settings} url="/settings" />
            <SidebarSection title="Monitoring" />
            <SidebarItem title="Storage" icon={DatabaseIcon} url="/database" />
            <SidebarItem title="Metrics" icon={ChartLine} url="/metrics" />
        </div>
    );
}

interface WithSidebarProps {
    children: React.ReactNode;
}

export function WithSidebar({ children }: WithSidebarProps) {
    return (
        <div className="flex flex-row max-h-[100vh]">
            <Sidebar />
            <div className="w-full h-[100vh] overflow-y-auto">{children}</div>
        </div>
    );
}
