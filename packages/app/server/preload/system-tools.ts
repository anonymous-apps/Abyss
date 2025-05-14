import * as DocumentDocuments from './base-records/document.document';
import * as DocumentTools from './base-records/tool.document';
import * as HelloWorldTools from './base-records/tool.helloworld';
import * as LabelChatTools from './base-records/tool.labelchat';
import { db } from './sqlite-connection';

window['system-tools'] = {
    defineRecordsIfMissing: async () => {
        const tools = [...Object.values(DocumentTools), ...Object.values(HelloWorldTools), ...Object.values(LabelChatTools)];
        for (const tool of tools) {
            const toolExists = await db.tables.toolDefinition.ref(tool.id!).exists();
            if (!toolExists) {
                await db.tables.toolDefinition.create(tool);
            }
        }
        const documents = [...Object.values(DocumentDocuments)];
        for (const document of documents) {
            const documentRef = await db.tables.document.ref(document.document.id!);
            if (!(await documentRef.exists())) {
                await db.tables.document.create(document.document);
                for (const cell of document.cells) {
                    await documentRef.addCellAtEnd(cell);
                }
            }
        }
    },
};
