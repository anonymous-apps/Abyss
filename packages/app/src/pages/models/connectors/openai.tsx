import { Input } from '@abyss/ui-components';
import React from 'react';

interface OpenAIConfigProps {
    selectedModel: string;
    config: {
        apiKey: string;
    };
    onModelChange: (model: string) => void;
    onConfigChange: (config: any) => void;
}

const DEFAULT_MODELS = [
    { label: 'GPT 4o', content: 'gpt-4o-2024-08-06' },
    { label: 'O3 Mini', content: 'o3-mini-2025-01-31' },
];

export function OpenAIConfig({ selectedModel, config, onModelChange, onConfigChange }: OpenAIConfigProps) {
    return (
        <>
            <Input label="Model ID" value={selectedModel} onChange={onModelChange} options={DEFAULT_MODELS} />
            <Input label="API Key" value={config.apiKey} onChange={onConfigChange} />
        </>
    );
}
