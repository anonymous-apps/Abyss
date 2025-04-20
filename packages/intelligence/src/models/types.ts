export interface LanguageModelChatResult {
    inputContext: any;
    response: string;
    metrics: Record<string, number>;
}
