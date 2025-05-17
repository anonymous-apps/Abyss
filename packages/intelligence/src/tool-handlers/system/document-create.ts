import { ReferencedDocumentRecord } from '@abyss/records/dist/records/document/document';
import { ToolHandler, type ToolHandlerExecutionInternal } from '../tool-handler';

interface DocumentCreateToolParameters {
    name: string;
    documentData: string;
}

export class DocumentCreateToolHandler extends ToolHandler {
    protected async _execute(params: ToolHandlerExecutionInternal): Promise<string> {
        console.log('DocumentCreateToolHandler', params);
        const parameters = params.request.parameters as DocumentCreateToolParameters;
        const raw = parameters.documentData;
        const parsed = JSON.parse(raw);
        console.log('Parsed', parsed);
        const document = await params.sqliteClient.tables.document.create({
            type: 'dynamic',
            name: parameters.name,
            documentContentData: [],
        });
        const documentRecord = new ReferencedDocumentRecord(document.id, params.sqliteClient);
        for (const node of parsed) {
            await documentRecord.addCellAtEnd({ ...node, authorId: params.callerId });
        }
        return 'Created document ' + document.id;
    }
}
