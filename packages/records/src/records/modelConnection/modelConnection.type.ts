import { BaseRecordProps } from '../recordClass';

export type ModelConnectionAccessFormat = 'gemini' | 'openai' | 'anthropic' | 'static';

export interface ModelConnection extends BaseRecordProps {
    // Name of the connection and description
    name: string;
    description: string;

    // Format for accessing the model, determines api call structure
    accessFormat: ModelConnectionAccessFormat;

    // ID of the provider and model
    providerId: string;
    modelId: string;

    // Additional data for the connection stored as JSON
    data: any;
}
