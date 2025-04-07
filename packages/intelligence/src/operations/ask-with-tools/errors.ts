export class ToolDefinitionNotFoundError extends Error {
    constructor(toolName: string) {
        super(`Tool definition not found for tool call: ${toolName}`);
        this.name = "ToolDefinitionNotFoundError";
    }
}
