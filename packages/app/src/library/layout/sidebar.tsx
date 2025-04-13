import { Sidebar as AbyssSidebar, SidebarButton as AbyssSidebarButton, SidebarSection as AbyssSidebarSection } from '@abyss/ui-components';
import { Bot, Box, ChartLine, DatabaseIcon, Loader2, MessageSquare, Play, Settings, X, type LucideIcon } from 'lucide-react';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    const location = useLocation();
    const nav = useNavigate();

    const navProps = (path: string) => ({
        onClick: () => nav(path),
        isActive: location.pathname.startsWith(path),
    });

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
        <div className="transition-opacity duration-[1.5s]" style={{ opacity }}>
            <AbyssSidebar className="pt-10">
                <AbyssSidebarSection title="Activity" />
                <AbyssSidebarButton label="Chats" icon={MessageSquare} {...navProps('/chats')} />
                <AbyssSidebarSection title="Configuration" />
                <AbyssSidebarButton label="Models" icon={Box} {...navProps('/models')} />
                <AbyssSidebarButton label="Agents" icon={Bot} {...navProps('/agents')} />
                <AbyssSidebarButton label="Tools" icon={Play} {...navProps('/tools')} />
                <AbyssSidebarButton label="Settings" icon={Settings} {...navProps('/settings')} />
                <AbyssSidebarSection title="Settings" />
                <AbyssSidebarButton label="Storage" icon={DatabaseIcon} {...navProps('/database')} />
                <AbyssSidebarButton label="Metrics" icon={ChartLine} {...navProps('/metrics')} />
            </AbyssSidebar>
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
