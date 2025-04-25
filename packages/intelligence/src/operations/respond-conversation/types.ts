import { Thread } from '../../constructs';
import { LanguageModel } from '../../models/language-model';
export interface AskWithToolCallsOptions {
    model: LanguageModel;
    thread: Thread;
}

export interface ToolDefinition {
    id: string;
    name: string;
    description: string;
    parameters: object;
}
