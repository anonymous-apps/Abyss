import { ToolDefinition } from '../../../operations/invoke-graph/types';
import { Thread } from '../thread';
import { ThreadMessagePartial } from '../types';
import { getExposedToolsInThread } from './getExposedToolsInThread';

export async function getToolMessageDelta(thread: Thread, expectedTools: ToolDefinition[]) {
    const currentTools = getExposedToolsInThread(thread);
    const addedTools = expectedTools.filter(tool => !currentTools.find(t => t.id === tool.id));
    const removedTools = currentTools.filter(tool => !expectedTools.find(t => t.id === tool.id));
    let partials: ThreadMessagePartial[] = [];
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
        newThread: await thread.addTurn({ sender: 'system', partials }),
        messages: partials,
    };
}
