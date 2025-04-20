import { Button, IconSection, Input, InputArea, PageCrumbed } from '@abyss/ui-components';
import { FileInput } from 'lucide-react';
import React from 'react';
import { useCreatePrompt } from './create-prompt.hook';

export function CreatePromptPage() {
    const { name, setName, text, setText, dimensions, setDimensions, handleCreatePrompt, isFormValid, navigate } = useCreatePrompt();

    return (
        <PageCrumbed
            title="Create Prompt"
            breadcrumbs={[
                { name: 'Home', onClick: () => navigate('/') },
                { name: 'Prompts', onClick: () => navigate('/prompts') },
                { name: 'Create', onClick: () => navigate('/prompts/create') },
            ]}
        >
            <IconSection title="Prompt Information" subtitle="Configure your prompt's basic information" icon={FileInput}>
                <div className="flex flex-col gap-4 max-w-2xl">
                    <Input label="Name" value={name} onChange={setName} placeholder="Name for this prompt" />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-200">Text</label>
                        <InputArea value={text} onChange={e => setText(e.target.value)} placeholder="The actual prompt text" rows={10} />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-200">Dimensions (JSON)</label>
                        <InputArea
                            value={dimensions}
                            onChange={e => setDimensions(e.target.value)}
                            placeholder='{"key": "value"}'
                            rows={5}
                        />
                    </div>
                </div>
            </IconSection>

            <div className="flex justify-end mt-6">
                <Button
                    onClick={handleCreatePrompt}
                    isDisabled={!isFormValid}
                    className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    Create Prompt
                </Button>
            </div>
        </PageCrumbed>
    );
}
