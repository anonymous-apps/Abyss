import { BaseDatabaseConnection, BaseRecord } from './_base';

export interface PromptRecord extends BaseRecord {
    name: string;
    text: string;
    dimensions?: Record<string, any>;
}

class _PromptController extends BaseDatabaseConnection<PromptRecord> {
    constructor() {
        super('prompt', 'Prompt with name, text, and optional dimensions');
    }
}

export const PromptController = new _PromptController();
