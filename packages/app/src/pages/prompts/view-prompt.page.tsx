import { Button, IconSection, Input, InputArea, PageCrumbed } from '@abyss/ui-components';
import { AlertCircle, FileInput, Trash2 } from 'lucide-react';
import React from 'react';
import { useViewPrompt } from './view-prompt.hook';

export function ViewPromptPage() {
    const { prompt, name, setName, text, setText, dimensions, setDimensions, breadcrumbs, handleUpdatePrompt, handleDelete, isDimensionValid, saveDimensions } =
        useViewPrompt();

    return (
        <PageCrumbed title={`Prompt: ${prompt.data?.name || ''}`} breadcrumbs={breadcrumbs}>
            <IconSection
                title="Prompt Information"
                icon={FileInput}
                action={<Button variant="secondary" icon={Trash2} onClick={handleDelete} />}
            >
                <div className="flex flex-col gap-4 max-w-2xl">
                    <Input
                        label="Name"
                        value={name}
                        onChange={setName}
                        placeholder="Name for this prompt"
                        onBlur={handleUpdatePrompt}
                    />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-200">Text</label>
                        <InputArea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="The actual prompt text"
                            rows={10}
                            onBlur={handleUpdatePrompt}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-text-200 flex justify-between items-center">
                            <span>Dimensions (JSON)</span>
                            {!isDimensionValid && (
                                <span className="inline-flex items-center gap-1 text-red-500">
                                    <AlertCircle size={14} />
                                    Invalid JSON
                                </span>
                            )}
                        </label>
                        <InputArea
                            value={dimensions}
                            onChange={e => setDimensions(e.target.value)}
                            placeholder='{"key": "value"}'
                            rows={5}
                            onBlur={saveDimensions}
                            className={!isDimensionValid ? 'border-red-500' : ''}
                        />
                    </div>
                </div>
            </IconSection>
        </PageCrumbed>
    );
}