import { HelloWorldTool } from './base-records/helloworld-tool';
import { LabelChatTool } from './base-records/labelchat-tool';
import { db } from './sqlite-connection';

window['system-tools'] = {
    defineSystemToolsIfMissing: async () => {
        const tools = [HelloWorldTool, LabelChatTool];
        for (const tool of tools) {
            const toolExists = await db.tables.toolDefinition.ref(tool.id!).exists();
            if (!toolExists) {
                await db.tables.toolDefinition.create(tool);
            }
        }
    },
};
