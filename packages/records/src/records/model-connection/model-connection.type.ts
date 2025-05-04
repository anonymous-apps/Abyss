import { BaseSqliteRecord } from '../../sqlite/sqlite.type';

export type ModelConnectionAccessFormat = 'gemini' | 'openai' | 'anthropic' | 'static';

export interface ModelConnectionType extends BaseSqliteRecord {
    name: string;
    description: string;
    accessFormat: ModelConnectionAccessFormat;
    providerId: string;
    modelId: string;
    data: any;
}
