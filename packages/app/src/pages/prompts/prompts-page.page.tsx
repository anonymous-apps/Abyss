import { Button, IconSection, PageCrumbed, Tile, TileGrid } from '@abyss/ui-components';
import { FileInput, Plus } from 'lucide-react';
import React from 'react';
import { usePromptsPage } from './prompts-page.hook';

export function PromptsPage() {
    const { prompts, handleCreatePrompt, navigate } = usePromptsPage();

    return (
        <PageCrumbed
            title="Prompts"
            breadcrumbs={[
                { name: 'Home', onClick: () => navigate('/') },
                { name: 'Prompts', onClick: () => navigate('/prompts') },
            ]}
        >
            <IconSection
                title="Prompts"
                icon={FileInput}
                action={<Button variant="secondary" icon={Plus} onClick={handleCreatePrompt} tooltip="Create Prompt" />}
            >
                {prompts.data && prompts.data.length > 0 ? (
                    <TileGrid>
                        {prompts.data.map(prompt => (
                            <Tile
                                key={prompt.id}
                                title={prompt.name || 'Untitled'}
                                onClick={() => navigate(`/prompts/id/${prompt.id}`)}
                                icon={<FileInput className="w-4 h-4" />}
                                footer={`${Object.keys(prompt.dimensions || {}).length} dimensions`}
                            >
                                {prompt.text.substring(0, 100)}...
                            </Tile>
                        ))}
                    </TileGrid>
                ) : (
                    <div className="text-text-700">No prompts found</div>
                )}
            </IconSection>
        </PageCrumbed>
    );
}
