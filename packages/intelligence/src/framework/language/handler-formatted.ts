import { LanguageModel } from '../../interfaces/language';
import { ChatContext } from '../../utils/chat-context';
import { BestEffortJsonParser } from '../../utils/parser';
import { AskWithFormatModelProps } from '../types';

export async function FormattedLanguageModel<T>(model: LanguageModel, props: AskWithFormatModelProps) {
    const chat = new ChatContext().addUserMessage(props.question).addUserMessage(`
        Please respond as a valid JSON string matching this format: 
        
        <output-format>
        ${JSON.stringify(props.formatExample, null, 2)}
        </output-format>
        
        Match the structure provided, a valid response string might be look like: 
        
        <example-response>
        { 
            "${Object.keys(props.formatExample)[0]}": . . . 
        }
        </example-response>
    `);

    const modelResponse = await model.invoke({ chat });
    const jsonData = BestEffortJsonParser(modelResponse.response);

    return {
        chat: chat.addBotMessage(modelResponse.response),
        response: modelResponse.response,
        apiCall: modelResponse.apiCall,
        parsed: jsonData as T,
    };
}
