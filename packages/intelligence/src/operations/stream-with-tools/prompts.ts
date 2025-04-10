import { ChatThread } from '../../constructs/chat-thread/chat-thread';
import { dedent } from '../../utils/dedent/dedent';
import { createXmlFromZod } from '../../utils/zod-to-xml/zod-to-xml';
import { ToolDefinition } from './types';

export function getIdForTool(tool: ToolDefinition) {
    return tool.name.toLowerCase().replace(/ /g, '-');
}

export function buildToolUsePrompt(thread: ChatThread, tools: ToolDefinition[]) {
    // If there are no tools, return the thread as is and dont add any tool use details
    if (tools.length === 0) {
        return thread;
    }

    const toolUseDetails = `
        ## Tool Usage
        I have setup a custom parser to handle special custom tool calls you can make use of.
        To use them, you can simply put XML directly into your response and the parser will capture this and run the requested tool call.
        Below ill details the tools available to you and how to use them.
        Its very important to follow the syntax exactly as it is written below, the parser is designed to be very strict and will throw an error if it is not followed.

    `;
    const toolCallsString = tools
        .map(
            tool =>
                dedent(`
                ### Tool: ${getIdForTool(tool)}
                ${tool.description}
                An example of its usage is below. If your response contains the XML representation of the tool call as part of your response, you will have invoked the tool.

            `) + createXmlFromZod(getIdForTool(tool), tool.parameters)
        )
        .join('\n');

    const ToolUseExamplePrompt = `

        ## Example of response syntax
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

        You only have these tools: [${tools
            .map(tool => getIdForTool(tool))
            .join(', ')}], calling other tools will result in an error and you must use xml syntax as in the example to call them. 
        You cannot just ask the user to call the tool, you must include the xml syntax as part of your response.
    `;

    return thread.addUserTextMessage(toolUseDetails).addUserTextMessage(toolCallsString).addUserTextMessage(ToolUseExamplePrompt);
}
