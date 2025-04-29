import { BaseRecordProps } from '../recordClass';

export type ModelConnectionAccessFormat = 'gemini' | 'openai' | 'anthropic' | 'static';

export interface ModelConnectionType extends BaseRecordProps {
    name: string;
    description: string;
    accessFormat: ModelConnectionAccessFormat;
    providerId: string;
    modelId: string;
    data: any;
}
