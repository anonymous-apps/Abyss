import { dedent } from '../../utils/dedent/dedent';
import { Log } from '../../utils/logs';
import { parseXml, XmlNode } from '../../utils/xml-parser/xml-parser';
import { createXmlFromZod } from '../../utils/zod-to-xml/zod-to-xml';
import { ToolDefinitionNotFoundError } from './errors';
import { AskWithToolCallsOptions, AskWithToolsResult } from './types';

export * from './errors';
export * from './types';

export async function askWithTools(options: AskWithToolCallsOptions): Promise<AskWithToolsResult> {
    const { model, thread, toolDefinitions } = options;
    Log.log('askWithTools', `Starting ask with tools against model ${model.getName()} with ${options.toolDefinitions.length} tools`);

    // Build the tool calls string
    const toolCallsString = toolDefinitions
        .map(
            tool =>
                dedent(`
                    ### Tool: ${tool.name}
                    ${tool.description}
                    An example of its usage is below. If your response contains the XML representation of the tool call as part of your response, you will have invoked the tool.

                `) + createXmlFromZod(tool.name, tool.parameters)
        )
        .join('\n');
    const prompt = `
        ## Tool Usage
        You can use the following tools to help the user which you can invoke by simply returning the XML representation of the tool call as part of your response.
        You can return as many tool calls as you want, call tools in any order you want and call a tool as many times as you want.
        You can put text between tools to help the user understand the context in which the tool is being called and why.
        Dont wrap your response in any fancy tags and just match exactly the XML format of the tool calls, there is a custom parser that will parse your response into a list of tool calls.
    `;

    const example = `
        ### Example
        Here is an example of what your response could look like if you did have a <generate_cat_picture> tool. Make sure to include both thoughts for the user and the tool calls.
        The user will read the thoughts and the tool calls so its important to include both so they know what you are doing and why.

        ------ begin example ------
        I see the user wants to generate a cat picture so i can use the generate_cat_picture tool to generate a cat picture.

        <generate_cat_picture>
            <prompt>A large fluffy cat with a big smile on its face, it looks cute and cuddly</prompt>
        </generate_cat_picture>

        I think thats all the user wants, so i will stop here.
        ------ end example ------

        ### Reminder

        You only have these tools: [${toolDefinitions.map(tool => tool.name).join(', ')}], calling other tools will result in an error.
    `;
    const threadWithToolCalls = thread.addUserTextMessage(prompt).addUserTextMessage(toolCallsString).addUserTextMessage(example);

    // Get the response
    const response = await model.invoke(threadWithToolCalls, options.cache);
    Log.log(
        'askWithTools',
        `Got response from model ${model.getName()} with response |${response.getLastBotTextMessage()?.substring(0, 50)} ...|`
    );

    // Parse the response
    const toolCalls = parseXml(response.getLastBotTextMessage() ?? '');
    const toolCallsResult = toolCalls.map((toolCall: XmlNode) => {
        const toolName = Object.keys(toolCall)[0];
        const toolDef = toolDefinitions.find(tool => tool.name === toolName);

        if (!toolDef) {
            throw new ToolDefinitionNotFoundError(toolName);
        }

        return {
            name: toolDef.name,
            parameters: toolCall[toolName] as Record<string, any>,
        };
    });

    Log.log(
        model.getName(),
        `Parsed ${toolCallsResult.length} tool calls from model: ${toolCallsResult.map(toolCall => toolCall.name).join(', ')}`
    );

    return {
        thread: response,
        toolCalls: toolCallsResult,
    };
}
