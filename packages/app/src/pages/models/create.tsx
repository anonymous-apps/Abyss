import { Box, Globe, Settings } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../library/input/button';
import { Input } from '../../library/input/input';
import { IconSection } from '../../library/layout/icon-section';
import { PageCrumbed } from '../../library/layout/page-crumbed';
import { WithSidebar } from '../../library/layout/sidebar';
import { AnthropicLogo, GeminiLogo, OpenAILogo } from '../../library/logos';
import { Database } from '../../main';
import { AnthropicConfig } from './connectors/anthropic';
import { GeminiConfig } from './connectors/gemini';
import { OpenAIConfig } from './connectors/openai';

const Providers = [
    {
        name: 'OpenAI',
        icon: <OpenAILogo className="w-6 h-6" />,
        component: OpenAIConfig,
    },
    {
        name: 'Gemini',
        icon: <GeminiLogo className="w-6 h-6" />,
        component: GeminiConfig,
    },
    {
        name: 'Anthropic',
        icon: <AnthropicLogo className="w-6 h-6" />,
        component: AnthropicConfig,
    },
];

export function ModelProfileCreatePage() {
    // Building a new profile
    const [selectedProvider, setSelectedProvider] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [data, setData] = useState<any>({});

    const navigate = useNavigate();

    const handleCreateConnection = () => {
        Database.table.modelConnections.create({
            name: name,
            description: 'A model connection for ' + selectedProvider + ' ' + selectedModel,
            provider: selectedProvider,
            modelId: selectedModel,
            data: data,
        });
        navigate('/models');
    };

    return (
        <WithSidebar>
            <PageCrumbed
                title="Create Model Profile"
                breadcrumbs={[
                    { name: 'Home', url: '/' },
                    { name: 'Models', url: '/models' },
                    { name: 'Create', url: '/models/create' },
                ]}
            >
                <IconSection title="Name" subtitle="The name for your model profile" icon={Box}>
                    <Input label="Name" value={name} onChange={setName} />
                </IconSection>

                <IconSection title="Provider" subtitle="Select the provider for your model connection" icon={Globe}>
                    <div className="grid grid-cols-5 gap-3">
                        {Providers.map(provider => (
                            <Button
                                key={provider.name}
                                onClick={() => setSelectedProvider(provider.name)}
                                selected={selectedProvider === provider.name}
                            >
                                {provider.icon}
                                {provider.name}
                            </Button>
                        ))}
                    </div>
                </IconSection>

                <IconSection
                    title="Provider Configuration"
                    subtitle={
                        selectedProvider
                            ? `Configure the ${selectedProvider} provider. Configuration data is stored locally on your machine.`
                            : 'Select a provider to continue'
                    }
                    icon={Settings}
                >
                    <div className={selectedProvider ? 'flex flex-col gap-4' : 'hidden'}>
                        {selectedProvider &&
                            Providers.find(provider => provider.name === selectedProvider)?.component({
                                selectedModel,
                                onModelChange: setSelectedModel,
                                config: data,
                                onConfigChange: setData,
                            })}
                        <Button className="max-w-[300px]" onClick={handleCreateConnection}>
                            Create Profile
                        </Button>
                    </div>
                </IconSection>
            </PageCrumbed>
        </WithSidebar>
    );
}
