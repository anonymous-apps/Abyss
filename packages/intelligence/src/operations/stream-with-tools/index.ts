import { StreamedChatResponse } from '../../constructs/streamed-chat-response/chat-response';
import { Log } from '../../utils/logs';
import { StreamParser } from '../../utils/parser/stream-parser';
import { buildToolUsePrompt } from './prompts';
import { AskWithToolCallsOptions } from './types';

export * from './errors';
export * from './types';

export async function streamWithTools(options: AskWithToolCallsOptions): Promise<StreamedChatResponse> {
    const { model, thread, toolDefinitions } = options;
    Log.log('askWithTools', `Starting ask with tools against model ${model.getName()} with ${options.toolDefinitions.length} tools`);

    // Build the tool calls string
    const threadWithToolCalls = buildToolUsePrompt(thread, toolDefinitions);

    // Call stream against model
    Log.log('askWithTools', `Streaming response from model ${model.getName()} . . .`);
    const stream = await model.stream(threadWithToolCalls);
    const parser = new StreamParser({
        stream,
        model,
        inputThread: threadWithToolCalls,
    });

    // Start parsing
    void parser.parse();

    return parser.chatResponse;
}
