import { IconOption } from '@abyss/ui-components';
import { Box, DatabaseIcon, MessageCircle, Play, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Database } from '../main';
import { useTableRecordUserSettings } from '../state/database-connection';
import { useSidebarFadeStore } from '../state/sidebar-fade';
export function MainPage() {
    const navigate = useNavigate();

    const [sidebarWidth, setSidebarWidth] = useState('40vw');
    const [contentOpacity, setContentOpacity] = useState(1);
    const { setSidebarFadeable } = useSidebarFadeStore();
    const userSettings = useTableRecordUserSettings();
    const [bootstrapped, setBootstrapped] = useState(false);

    useEffect(() => {
        if (!userSettings.loading && userSettings.data && !userSettings.data.bootstrapped && !bootstrapped) {
            Database.bootstrap.bootstrapping.bootstrapDB();
            setBootstrapped(true);
        }
    }, [bootstrapped, userSettings.loading]);

    useEffect(() => {
        setSidebarFadeable(true);
    }, []);

    const handleNavigation = (href: string) => {
        setSidebarWidth('150px');
        setContentOpacity(0);
        setTimeout(() => {
            navigate(href, { viewTransition: true });
        }, 1000);
    };

    //@ts-ignore
    const logoPath = window.fs.assetPath('logo.png');

    return (
        <div className="flex h-screen">
            <div className="flex flex-col items-center justify-center transition-all duration-[1s]" style={{ width: sidebarWidth }}>
                <img
                    src={logoPath}
                    alt="logo"
                    className="w-[150px] mb-4 transition-all duration-[1s]"
                    style={{ opacity: contentOpacity }}
                />
                <div
                    className="text-4xl font-bold text-center transition-all duration-[1s] text-text-300"
                    style={{ opacity: contentOpacity }}
                >
                    Abyss
                </div>
            </div>

            <div
                className={`p-8 overflow-auto flex-1 flex items-center justify-center transition-all duration-[1s] ${
                    sidebarWidth === '150px' ? 'w-full' : 'w-[calc(100vw-150px)] bg-background-300 '
                } `}
                style={{ paddingLeft: `calc(100vw - calc(60vw + ${sidebarWidth}) + 20px)` }}
            >
                <div className="max-w-2xl w-full space-y-4 transition-all duration-[1s]" style={{ opacity: contentOpacity }}>
                    <IconOption title="Models" icon={Box} onClick={() => handleNavigation('/models')}>
                        Connect to AI models locally using Ollama or cloud providers like OpenAI or Aws Bedrock
                    </IconOption>

                    <IconOption title="Chats" icon={MessageCircle} onClick={() => handleNavigation('/chats')}>
                        Chat with AI models directly or with custom agents you build
                    </IconOption>

                    <IconOption title="Tools" icon={Play} onClick={() => handleNavigation('/tools')}>
                        Connect to MCP servers and leverage their tools to automate your workflows, or build your own tools.
                    </IconOption>

                    <IconOption title="Database" icon={DatabaseIcon} onClick={() => handleNavigation('/database')}>
                        View saved data stored on your machine. All data is stored locally in sqlite and can be accessed by you at any time.
                    </IconOption>

                    <IconOption title="Settings" icon={Settings} onClick={() => handleNavigation('/settings')}>
                        Configure application settings, themes, and other preferences.
                    </IconOption>
                </div>
            </div>
        </div>
    );
}
