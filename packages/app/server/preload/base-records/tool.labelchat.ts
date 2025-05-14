import { NewRecord, ToolDefinitionType } from '@abyss/records';

export const LabelChatTool: NewRecord<ToolDefinitionType> = {
    id: 'toolDefinition::labelchat-tool',
    name: 'Label Chat',
    shortName: 'labelchat',
    description:
        'A tool that allows you give a label to the current chat. Ideally, call this 1x in the entire chat at the point when you have a clear idea of what the chat is about. If the conversation changes drastically, consider calling this again.',
    handlerType: 'abyss',
    inputSchemaData: [
        {
            type: 'string',
            name: 'label',
            description:
                'The label to give to the current chat, ideally 3-5 short words. The user will see this label in the chat history for their reference.',
        },
    ],
    outputSchemaData: [],
};
