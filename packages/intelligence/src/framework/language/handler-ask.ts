import { LanguageModel } from '../../interfaces/language';
import { ChatContext } from '../../utils/chat-context';
import { AskModelProps } from '../types';

export async function AskLangaugeModel(model: LanguageModel, props: AskModelProps) {
    const chat = new ChatContext().addUserMessage(props.question);
    const response = await model.invoke({ chat });
    return {
        response: response.response,
        apiCall: response.apiCall,
        chat: chat.addBotMessage(response.response),
    };
}
