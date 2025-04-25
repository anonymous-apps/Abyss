import { ToolDefinition } from '../../../operations/respond-conversation/types';
import { ChatThread } from '../chat-thread';
import { ChatMessagePartial } from '../types';
import { getExposedToolsInThread } from './getExposedToolsInThread';

export function getToolMessageDelta(thread: ChatThread, expectedTools: ToolDefinition[]) {
    const currentTools = getExposedToolsInThread(thread);
    const addedTools = expectedTools.filter(tool => !currentTools.find(t => t.id === tool.id));
    const removedTools = currentTools.filter(tool => !expectedTools.find(t => t.id === tool.id));
    let partials: ChatMessagePartial[] = [];
    if (removedTools.length > 0) {
        partials.push({
            type: 'toolDefinitionRemoved',
            toolDefinitionRemoved: { toolDefinitions: removedTools },
        });
    }
    if (addedTools.length > 0) {
        partials.push({
            type: 'toolDefinitionAdded',
            toolDefinitionAdded: { toolDefinitions: addedTools },
        });
    }
    if (partials.length === 0) {
        return {
            newThread: thread,
            messages: [],
        };
    }
    return {
        newThread: thread.addTurn({ sender: 'system', partials }),
        messages: partials,
    };
}
