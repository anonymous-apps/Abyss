import { Input } from '@abyss/ui-components';
import React from 'react';

interface GeminiConfigProps {
    selectedModel: string;
    config: {
        apiKey: string;
    };
    onModelChange: (model: string) => void;
    onConfigChange: (config: any) => void;
}

const DEFAULT_MODELS = [{ id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash' }];

export function GeminiConfig({ selectedModel, config, onModelChange, onConfigChange }: GeminiConfigProps) {
    return (
        <>
            <Input label="Model ID" value={selectedModel} onChange={e => onModelChange(e.target.value)} />
            <Input label="API Key" value={config.apiKey} onChange={e => onConfigChange({ ...config, apiKey: e })} />
        </>
    );
}
