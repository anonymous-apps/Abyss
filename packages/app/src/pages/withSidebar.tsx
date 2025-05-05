import { Sidebar as AbyssSidebar, SidebarButton as AbyssSidebarButton, SidebarSection as AbyssSidebarSection } from '@abyss/ui-components';
import { Bot, Box, ChartLine, DatabaseIcon, List, MessageSquare, SettingsIcon } from 'lucide-react';
import React from 'react';
import { useLocation, useNavigate, useOutlet } from 'react-router';
import { useSidebarFadeStore } from '../state/sidebar-fade';

export function AppSidebar() {
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
        <div className="transition-opacity duration-[0.5s]" style={{ opacity }}>
            <AbyssSidebar className="" title="Abyss">
                <AbyssSidebarSection title="Activity" />
                <AbyssSidebarButton label="Chats" icon={MessageSquare} {...navProps('/chats')} />
                <AbyssSidebarSection title="Configure" />
                <AbyssSidebarButton label="Models" icon={Box} {...navProps('/models')} />
                <AbyssSidebarButton label="Agents" icon={Bot} {...navProps('/agents')} />
                <AbyssSidebarButton label="Settings" icon={SettingsIcon} {...navProps('/settings')} />
                <AbyssSidebarSection title="Monitor" />
                <AbyssSidebarButton label="Storage" icon={DatabaseIcon} {...navProps('/database')} />
                <AbyssSidebarButton label="Metrics" icon={ChartLine} {...navProps('/metrics')} />
                <AbyssSidebarButton label="Logs" icon={List} {...navProps('/logs')} />
            </AbyssSidebar>
        </div>
    );
}

export function WithAppSidebar() {
    const outlet = useOutlet();

    return (
        <div className="flex flex-row max-h-[100vh]">
            <AppSidebar />
            <div className="w-full h-[100vh] overflow-y-auto">{outlet}</div>
        </div>
    );
}
