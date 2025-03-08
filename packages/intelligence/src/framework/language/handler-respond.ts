import { LanguageModel } from '../../interfaces/language';
import { ChatContext } from '../../utils/chat-context';
import { RespondModelProps } from '../types';

export async function RespondLanguageModel(model: LanguageModel, props: RespondModelProps) {
    const response = await model.invoke({ chat: props.context });
    return {
        response: response.response,
        apiCall: response.apiCall,
        chat: props.context.addBotMessage(response.response),
    };
}
