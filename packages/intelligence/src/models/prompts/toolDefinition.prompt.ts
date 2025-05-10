import { PromptTemplate } from '@abyss/prompts';
import { ToolDefinitionInputProperty, ToolDefinitionOutputProperty, ToolDefinitionType } from '@abyss/records';

const buildObjectFromProperties = (properties: ToolDefinitionInputProperty[] | ToolDefinitionOutputProperty[]) => {
    const object: Record<string, string> = {};
    for (const property of properties) {
        object[property.name] = property.description;
    }
    return object;
};

const buildExampleUsageFromProperties = (properties: ToolDefinitionInputProperty[]) => {
    const object: Record<string, string> = {};
    for (const property of properties) {
        let exampleContent = '';
        if (property.type === 'string') {
            exampleContent = `<![CDATA[Hello, world!]]>`;
        } else if (property.type === 'number') {
            exampleContent = `123`;
        } else if (property.type === 'boolean') {
            exampleContent = `true`;
        }
        object[property.name] = exampleContent;
    }
    return object;
};

export const toolDefinitionTemplate = new PromptTemplate<ToolDefinitionType>()
    .addHeader3(params => `TOOL: ${params.shortName}`)
    .addText(params => params.description)
    .addXMLElement((params: ToolDefinitionType) => ({ 'input-schema': buildObjectFromProperties(params.inputSchemaData) }))
    .addXMLElement((params: ToolDefinitionType) => ({ 'output-schema': buildObjectFromProperties(params.outputSchemaData) }))
    .addXMLElement((params: ToolDefinitionType) => ({ 'example-usage': buildExampleUsageFromProperties(params.inputSchemaData) }));

export const addToolDefinitionPrompt = new PromptTemplate<ToolDefinitionType[]>()
    .addHeader2('New Tools')
    .addText('You were just given access to the following new tools, they are accessable to you now:')
    .addSubPrompt(params => params.map(tool => toolDefinitionTemplate.compile(tool)));
