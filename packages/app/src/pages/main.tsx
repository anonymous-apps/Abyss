import React, { ReactNode, useState, useEffect } from 'react';
import { Box, Database, MessageCircle, Play, Settings, LucideIcon } from 'lucide-react';
import { useSidebarFadeStore } from '../state/sidebar-fade';
import { ClickableIconOption } from '../library/layout/nav-options';
import { useNavigate } from 'react-router';

export function MainPage() {
    const navigate = useNavigate();
    const [sidebarWidth, setSidebarWidth] = useState('40vw');
    const [contentOpacity, setContentOpacity] = useState(1);
    const { setSidebarFadeable } = useSidebarFadeStore();

    useEffect(() => {
        setSidebarFadeable(true);
    }, []);

    const handleNavigation = (href: string) => {
        setSidebarWidth('150px');
        setContentOpacity(0);
        setTimeout(() => {
            navigate(href, { viewTransition: true });
        }, 300);
    };

    return (
        <div className="flex h-screen">
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

            <div
                className={`p-8 overflow-auto flex-1 flex items-center justify-center transition-all duration-300 ${
                    sidebarWidth === '150px' ? 'w-full' : 'w-[calc(100vw-150px)]'
                } ${contentOpacity === 0 ? 'bg-background-transparent' : 'bg-white'}`}
                style={{ paddingLeft: `calc(100vw - calc(60vw + ${sidebarWidth}) + 20px)` }}
            >
                <div className="max-w-2xl w-full space-y-4 transition-all duration-300" style={{ opacity: contentOpacity }}>
                    <ClickableIconOption title="Models" icon={Box} onClick={() => handleNavigation('/model-connection')}>
                        Connect to AI models locally using Ollama or cloud providers like OpenAI or Aws Bedrock
                    </ClickableIconOption>

                    <ClickableIconOption title="Chats" icon={MessageCircle} onClick={() => handleNavigation('/chats')}>
                        Chat with AI models directly or with custom agents you build
                    </ClickableIconOption>

                    <ClickableIconOption title="Actions" icon={Play} onClick={() => handleNavigation('/actions')}>
                        Connect to MCP servers and leverage their actions to automate your workflows, or build your own actions.
                    </ClickableIconOption>

                    <ClickableIconOption title="Database" icon={Database} onClick={() => handleNavigation('/database')}>
                        View saved data stored on your machine. All data is stored locally in sqlite and can be accessed by you at any time.
                    </ClickableIconOption>

                    <ClickableIconOption title="Settings" icon={Settings} onClick={() => handleNavigation('/settings')}>
                        Configure application settings, themes, and other preferences.
                    </ClickableIconOption>
                </div>
            </div>
        </div>
    );
}
