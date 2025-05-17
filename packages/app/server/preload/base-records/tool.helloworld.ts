import type { NewRecord, ToolDefinitionType } from '@abyss/records';

export const HelloWorldTool: NewRecord<ToolDefinitionType> = {
    id: 'toolDefinition::helloworld-tool',
    name: 'Hello World',
    shortName: 'helloworld',
    description: 'A debug tool that echos back the input when called',
    handlerType: 'abyss',
    inputSchemaData: [
        {
            type: 'string',
            name: 'input',
            description: 'The input to echo back',
        },
    ],
    outputSchemaData: [
        {
            type: 'string',
            name: 'output',
            description: 'The echoed input',
        },
    ],
};
