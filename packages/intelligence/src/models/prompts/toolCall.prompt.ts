import { PromptTemplate } from '@abyss/prompts';
import { ToolCallRequestPartial, ToolCallResponsePartial } from '@abyss/records';

export const toolCallRequestPrompt = new PromptTemplate<ToolCallRequestPartial>().addXMLElement((params: ToolCallRequestPartial) => ({
    [params.payloadData.shortName]: params.payloadData.parameters,
}));

type ToolCallResponsePromptParams = {
    request: ToolCallRequestPartial;
    response: ToolCallResponsePartial;
};

export const toolCallResponsePrompt = new PromptTemplate<ToolCallResponsePromptParams>().addXMLElement(
    (a: ToolCallResponsePromptParams) => ({
        'tool-call-response': {
            tool: a.response.payloadData.shortName,
            result: a.response.payloadData.result,
            status: a.response.payloadData.status,
        },
    })
);

export const toolUseInstructionsPrompt = new PromptTemplate().addHeader2('Tool Use Instructions').addText(`
    This chat is hooked up to a special parser which can handle tools directly in your response text.
    This may be different than what you are used to, but it is a powerful feature that allows you to use tools in a natural way.
    Whenver you responce contains an XML element, the parser will automatically extract the tool name and parameters to be run. 
    The user will be able to tell you what result was produced and send it back to you later on.

    To call a tool, you can respond with XML in the format below

    <tool-name-1>
        <param-name-1>param-value-1</param-name-1>
        <param-name-2>param-value-2</param-name-2>
    </tool-name-1>

    You can call as many tools as you want, in any order interspersed with normal text.
    
    <tool-name-2>
        <param-name-1>param-value-1</param-name-1>
        <param-name-2>param-value-2</param-name-2>
    </tool-name-2>
`);
