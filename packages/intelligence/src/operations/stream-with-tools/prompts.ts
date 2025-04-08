import { ChatThread } from '../../constructs/chat-thread/chat-thread';
import { dedent } from '../../utils/dedent/dedent';
import { createXmlFromZod } from '../../utils/zod-to-xml/zod-to-xml';
import { ToolDefinition } from './types';

export function buildToolUsePrompt(thread: ChatThread, tools: ToolDefinition[]) {
    const toolCallsString = tools
        .map(
            tool =>
                dedent(`
                    ### Tool: ${tool.name}
                    ${tool.description}
                    An example of its usage is below. If your response contains the XML representation of the tool call as part of your response, you will have invoked the tool.

                `) + createXmlFromZod(tool.name, tool.parameters)
        )
        .join('\n');

    const toolUseDetails = `
        ## Tool Usage
        You can use the following tools to help the user which you can invoke by simply returning the XML representation of the tool call as part of your response.
        You can return as many tool calls as you want, call tools in any order you want and call a tool as many times as you want.
        You can put text between tools to help the user understand the context in which the tool is being called and why.
        Dont wrap your response in any fancy tags and just match exactly the XML format of the tool calls, there is a custom parser that will parse your response into a list of tool calls.
    `;

    const ToolUseExamplePrompt = `

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

        You only have these tools: [${tools.map(tool => tool.name).join(', ')}], calling other tools will result in an error.
    `;

    return thread.addUserTextMessage(toolUseDetails).addUserTextMessage(toolCallsString).addUserTextMessage(ToolUseExamplePrompt);
}
