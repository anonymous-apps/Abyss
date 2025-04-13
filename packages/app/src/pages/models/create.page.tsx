import { Button, IconSection, Input, PageCrumbed } from '@abyss/ui-components';
import { Box, Globe, Settings } from 'lucide-react';
import React from 'react';
import { AnthropicLogo, GeminiLogo, OpenAILogo } from '../../library/logos';
import { AnthropicConfig } from './connectors/anthropic';
import { GeminiConfig } from './connectors/gemini';
import { OpenAIConfig } from './connectors/openai';
import { useModelProfileCreate } from './create.hook';

const Providers = [
    {
        name: 'OpenAI',
        icon: <OpenAILogo logo="OpenAI" className="w-6 h-6" />,
        component: OpenAIConfig,
    },
    {
        name: 'Gemini',
        icon: <GeminiLogo logo="Gemini" className="w-6 h-6" />,
        component: GeminiConfig,
    },
    {
        name: 'Anthropic',
        icon: <AnthropicLogo logo="Anthropic" className="w-6 h-6" />,
        component: AnthropicConfig,
    },
];

export function ModelProfileCreatePage() {
    const {
        selectedProvider,
        setSelectedProvider,
        selectedModel,
        setSelectedModel,
        name,
        setName,
        data,
        setData,
        handleCreateConnection,
        breadcrumbs,
    } = useModelProfileCreate();

    return (
        <PageCrumbed title="Create Model Profile" breadcrumbs={breadcrumbs}>
            <IconSection title="Name" subtitle="The name for your model profile" icon={Box}>
                <Input label="Name" value={name} onChange={setName} />
            </IconSection>

            <IconSection title="Provider" subtitle="Select the provider for your model connection" icon={Globe}>
                <div className="flex flex-row gap-1">
                    {Providers.map(provider => (
                        <Button
                            key={provider.name}
                            onClick={() => setSelectedProvider(provider.name)}
                            variant="primary"
                            isInactive={selectedProvider !== provider.name}
                            className="gap-4"
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
    );
}
