import { db } from './sqlite-connection';

window['system-tools'] = {
    defineSystemToolsIfMissing: async () => {
        const createNodeJsScriptTool = await db.tables.toolDefinition.ref('system::create-node-tool').exists();
        if (!createNodeJsScriptTool) {
            await db.tables.toolDefinition.create({
                id: 'system::create-node-tool',
                name: 'Create Node.js Script',
                description: 'Create a new Node.js script',
                handlerType: 'abyss',
                inputSchemaData: [],
                outputSchemaData: [],
            });
        }
    },
};
