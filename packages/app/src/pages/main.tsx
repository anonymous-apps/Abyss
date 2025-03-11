import React, { ReactNode, useState, useEffect } from 'react';
import { Box, Database, MessageCircle, Play, Settings, LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSidebarFadeStore } from '../state/sidebar-fade';

interface NavOptionProps {
    title: string;
    icon: LucideIcon;
    children: ReactNode;
    href: string;
    onNavigate: () => void;
}

const NavOption: React.FC<NavOptionProps> = ({ title, icon: Icon, children, href, onNavigate }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        onNavigate();
        setTimeout(() => {
            navigate(href, { viewTransition: true });
        }, 300); // Wait for animation to complete
    };

    return (
        <div
            className="flex items-center p-4 rounded-md transition-all duration-200 
                border border-transparent hover:border-gray-200 hover:shadow-sm
                cursor-pointer"
            onClick={handleClick}
        >
            <Icon size={24} className="mr-4 text-primary" />
            <div className="flex-1">
                <h3 className="text-sm xl:text-lg mb-1">{title}</h3>
                <div className="text-xs xl:text-sm text-gray-600">{children}</div>
            </div>
        </div>
    );
};

export function MainPage() {
    const [sidebarWidth, setSidebarWidth] = useState('40vw');
    const [contentOpacity, setContentOpacity] = useState(1);
    const { setSidebarFadeable } = useSidebarFadeStore();

    useEffect(() => {
        setSidebarFadeable(true);
    }, []);

    const handleNavigation = () => {
        setSidebarWidth('150px');
        setContentOpacity(0);
    };

    return (
        <div className="flex h-screen ">
            {/* Left Side - Logo and App Name */}
            <div
                className="flex flex-col items-center justify-center bg-transparent transition-all duration-300"
                style={{ width: sidebarWidth }}
            >
                <img
                    src="/logo.png"
                    alt="logo"
                    className="w-[150px] mb-4 transition-all duration-300"
                    style={{ opacity: contentOpacity }}
                />
                <div className="text-4xl font-bold text-center transition-all duration-300" style={{ opacity: contentOpacity }}>
                    Abyss
                </div>
            </div>

            {/* Center Border */}
            <div className="w-[1px] bg-gray-200 h-full" />

            {/* Right Side - Options with minimal styling */}
            <div
                className="bg-white p-8 overflow-auto flex-1 flex items-center justify-center transition-all duration-300"
                style={{ paddingLeft: `calc(100vw - calc(60vw + ${sidebarWidth}) + 20px)` }}
            >
                <div className="max-w-2xl w-full space-y-4 transition-all duration-300" style={{ opacity: contentOpacity }}>
                    <NavOption title="Models" icon={Box} href="/model-connection" onNavigate={handleNavigation}>
                        Connect to AI models locally using Ollama or cloud providers like OpenAI or Aws Bedrock
                    </NavOption>

                    <NavOption title="Chats" icon={MessageCircle} href="/chats" onNavigate={handleNavigation}>
                        Chat with AI models directly or with custom agents you build
                    </NavOption>

                    <NavOption title="Actions" icon={Play} href="/actions" onNavigate={handleNavigation}>
                        Connect to MCP servers and leverage their actions to automate your workflows, or build your own actions.
                    </NavOption>

                    <NavOption title="Database" icon={Database} href="/database" onNavigate={handleNavigation}>
                        View saved data stored on your machine. All data is stored locally in sqlite and can be accessed by you at any time.
                    </NavOption>

                    <NavOption title="Settings" icon={Settings} href="/settings" onNavigate={handleNavigation}>
                        Configure application settings, themes, and other preferences.
                    </NavOption>
                </div>
            </div>
        </div>
    );
}
