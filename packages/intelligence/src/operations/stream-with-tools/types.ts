import { AnyZodObject } from "zod";
import { ChatThread } from "../../constructs";
import { LanguageModel } from "../../models/language-model";
import { StorageController } from "../../storage";
export interface AskWithToolCallsOptions {
    model: LanguageModel;
    thread: ChatThread;
    toolDefinitions: ToolDefinition[];
    cache?: StorageController;
}

export interface ToolDefinition {
    name: string;
    description: string;
    parameters: AnyZodObject;
}

export interface AskWithToolsResult {
    thread: ChatThread;
    toolCalls: ToolCall[];
}

export interface ToolCall {
    name: string;
    parameters: Record<string, any>;
}
