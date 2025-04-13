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
    { id: 'gpt-4o-2024-08-06', name: 'GPT 4o' },
    { id: 'o3-mini-2025-01-31', name: 'O3 Mini' },
];

export function OpenAIConfig({ selectedModel, config, onModelChange, onConfigChange }: OpenAIConfigProps) {
    return (
        <>
            <Input label="Model ID" value={selectedModel} onChange={e => onModelChange(e.target.value)} />
            <Input label="API Key" value={config.apiKey} onChange={e => onConfigChange({ ...config, apiKey: e })} />
        </>
    );
}
