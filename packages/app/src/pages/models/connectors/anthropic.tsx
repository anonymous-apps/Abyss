import React from 'react';
import { Input } from '../../../library/input/input';

interface AnthropicConfigProps {
    selectedModel: string;
    config: {
        apiKey: string;
    };
    onModelChange: (model: string) => void;
    onConfigChange: (config: any) => void;
}

const DEFAULT_MODELS = [{ id: 'claude-3-7-sonnet-20250219', name: 'Claude 3.7 Sonnet' }];

export function AnthropicConfig({ selectedModel, config, onModelChange, onConfigChange }: AnthropicConfigProps) {
    return (
        <>
            <Input label="Model ID" value={selectedModel} onChange={onModelChange} options={DEFAULT_MODELS} />
            <Input label="API Key" value={config.apiKey} onChange={e => onConfigChange({ ...config, apiKey: e })} />
        </>
    );
}
