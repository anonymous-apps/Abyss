import { Thread, ThreadMessagePartial } from '../thread';

type AIProviderBaseProps = {
    id: string;
};

export interface AIProviderGemini extends AIProviderBaseProps {
    type: 'gemini';
    provider: string;
    modelId: string;
    data: {
        apiKey: string;
    };
}

export interface AIProviderOpenAI extends AIProviderBaseProps {
    type: 'openai';
    provider: string;
    modelId: string;
    data: {
        apiKey: string;
    };
}

export interface AIProviderAnthropic extends AIProviderBaseProps {
    type: 'anthropic';
    provider: string;
    modelId: string;
    data: {
        apiKey: string;
    };
}

export type IntelligenceProps = AIProviderGemini | AIProviderOpenAI | AIProviderAnthropic;

export interface InvokeModelChatResult {
    inputRaw: any;
    outputRaw: any;
    outputString: string;
    outputParsed: ThreadMessagePartial[];
    outputThread: Thread;
    metrics: Record<string, number>;
}
