import React from 'react';
import { Input } from '../../../library/input/input';

interface OpenAIConfigProps {
    selectedModel: string;
    config: {
        apiKey: string;
    };
    onModelChange: (model: string) => void;
    onConfigChange: (config: any) => void;
}

const DEFAULT_MODELS = [
    { id: 'gpt-4o-2024-08-06', name: 'gpt-4o' },
    { id: 'o3-mini-2025-01-31', name: 'o3-mini' },
];

export function OpenAIConfig({ selectedModel, config, onModelChange, onConfigChange }: OpenAIConfigProps) {
    return (
        <>
            <Input label="Model ID" value={selectedModel} onChange={onModelChange} options={DEFAULT_MODELS} />
            <Input label="API Key" value={config.apiKey} onChange={e => onConfigChange({ ...config, apiKey: e })} />
        </>
    );
}
