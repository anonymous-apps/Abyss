import { AnyZodObject } from 'zod';
import { ChatThread } from '../../constructs';
import { LanguageModel } from '../../models/language-model';
export interface AskWithToolCallsOptions {
    model: LanguageModel;
    thread: ChatThread;
    toolDefinitions: ToolDefinition[];
}

export interface ToolDefinition {
    name: string;
    description: string;
    parameters: AnyZodObject;
}
