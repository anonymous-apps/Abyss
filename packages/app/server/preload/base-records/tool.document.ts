import { NewRecord, ToolDefinitionType } from '@abyss/records';

export const DocumentCreateTool: NewRecord<ToolDefinitionType> = {
    id: 'toolDefinition::document-create-tool',
    name: 'Document Create',
    shortName: 'document-create',
    description: 'A tool that allows you to create a new document. This will create a new document with a name and a content.',
    handlerType: 'abyss',
    inputSchemaData: [
        {
            type: 'string',
            name: 'name',
            description: 'The natural language name of the document to create.',
        },
        {
            type: 'raw-json',
            name: 'documentData',
            description:
                'The content of the document to create, in JSON format. This will be an array of cells like [{ "type": "text", "content": "Hello, world!" } ... ]',
        },
    ],
    outputSchemaData: [],
    linkedDocumentData: ['document::prompt-document'],
};
