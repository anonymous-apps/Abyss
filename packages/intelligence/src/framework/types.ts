import { ImageModel } from '../interfaces/image';
import { LanguageModel } from '../interfaces/language';
import { ChatContext } from '../utils/chat-context';

export interface IntelegenceProps {
    language?: LanguageModel;
    image?: ImageModel;
}

export interface IntelegenceLogger {
    onApiCall?: (apiCall: ApiCall) => void;
}

export interface ApiCall {
    endpoint: string;
    method: string;
    status: string;
    body: any;
    response: any;
}

export interface RespondModelProps {
    context: ChatContext;
}

export interface AskModelProps {
    question: string;
}

export interface AskWithFormatModelProps {
    question: string;
    formatExample: any;
}

export interface AskWithToolsModelProps {
    context: ChatContext;
    tools: AskModelTool[];
}

export interface AskModelTool {
    name: string;
    description: string;
    format: any;
}

export interface ImagineProps {
    prompt: string;
}
