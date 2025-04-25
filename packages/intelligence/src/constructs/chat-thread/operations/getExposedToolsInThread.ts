import { ToolDefinition } from '../../../operations/respond-conversation/types';
import { ChatThread } from '../chat-thread';

export function getExposedToolsInThread(thread: ChatThread): ToolDefinition[] {
    let tools: Record<string, ToolDefinition> = {};
    for (const turn of thread.getTurns()) {
        for (const partial of turn.partials) {
            if (partial.type === 'toolDefinitionAdded') {
                for (const tool of partial.toolDefinitionAdded.toolDefinitions) {
                    tools[tool.id] = tool;
                }
            } else if (partial.type === 'toolDefinitionRemoved') {
                for (const tool of partial.toolDefinitionRemoved.toolDefinitions) {
                    delete tools[tool.id];
                }
            }
        }
    }
    return Object.values(tools);
}
