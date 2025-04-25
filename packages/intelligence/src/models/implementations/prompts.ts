import { ToolDefinition } from '../../operations/respond-conversation/types';
import { createXmlFromObject } from '../../utils/object-to-xml/object-to-xml';

export function buildToolDefinitionPrompt(toolDefinitions: ToolDefinition[]) {
    return toolDefinitions
        .map(
            tool => `
                ## Tool Definition: ${tool.name} (${tool.id})
                You now have access to a new tool, ${tool.id}.
                
                <tool_description>
                    ${tool.description}
                </tool_description>

                <tool_schema>
                    To use this tool, follow the schema below using the tool id as the root element:

                    ${createXmlFromObject(tool.id, tool.parameters)}
                </tool_schema>
            `
        )
        .join('\n');
}

export function buildToolPermissionRemovedPrompt(toolDefinitions: ToolDefinition[]) {
    return toolDefinitions
        .map(
            tool => `    
                ## Tool Permission Removed: ${tool.id}
                You no longer have access to the tool, ${tool.id}, it has been removed from the tool list associated with your context.
            `
        )
        .join('\n');
}
