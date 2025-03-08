import { ChatContext } from '../../utils/chat-context';
import { jsonToXml } from '../../utils/json-to-xml-tools';
import { parseOutSimpleXml } from '../../utils/xml-parser';
import { AskWithToolsModelProps } from '../types';
import { LanguageModel } from '../../interfaces/language';
import { dedent } from '../../utils/dedent';

export async function ToolsLanguageModel(model: LanguageModel, props: AskWithToolsModelProps) {
    const tools = props.tools.map(tool =>
        dedent(`
        You have the following tool: ${tool.name}. ${tool.description}
        <${tool.name}>
            ${jsonToXml(tool.format)}
        </${tool.name}>
    `)
    );

    const chat = props.context.addUserMessage(`
            You have the following tools available to you:
            ${tools.join('\n\n')}
        `).addUserMessage(`
            Please respond with a collection of tool calls where each tool call is an XML object:

            <TOOLNAME>
                <parameter1>value1</parameter1>
                <parameter2>value2</parameter2>
            </TOOLNAME>

            You can make many tool calls. You can also intersperse your responses with natural language. Write your thoughts, call tools, think some more, call more tools, ect.
            You perform best when you do not hold back and call as many tools as you think are relevant fror the request. This could be 1 or 100. The xml will be parsed out automatically so don't worry about it.
        `);

    const modelResponse = await model.invoke({ chat });
    const xmlData = parseOutSimpleXml(modelResponse.response);

    return {
        chat: chat.addBotMessage(modelResponse.response),
        ...modelResponse,
        parsed: xmlData,
    };
}
