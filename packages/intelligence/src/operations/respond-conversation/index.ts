import { parseString } from '../../parser/parser';
import { Log } from '../../utils/logs';
import { buildToolUsePrompt } from './prompts';
import { AskWithToolCallsOptions } from './types';

export * from './errors';
export * from './types';

export async function generateWithTools(options: AskWithToolCallsOptions) {
    const { model, thread, toolDefinitions } = options;
    Log.log('generateWithTools', `Generating with tools against model ${model.getName()} with ${options.toolDefinitions.length} tools`);

    // Build the tool calls string
    const threadWithToolCalls = buildToolUsePrompt(thread, toolDefinitions);

    // Call model to get response
    Log.log('generateWithTools', `Getting response from model ${model.getName()} . . .`);
    const result = await model.invoke(threadWithToolCalls);

    // Parse the response to extract tool calls
    const messages = parseString(result.response);
    const resultThread = thread.addManyBotMessages(messages);

    // Return the result
    return {
        threadInput: thread,
        threadIntermediate: threadWithToolCalls,
        threadOutput: resultThread,
        outputRaw: result.response,
        outputMessages: messages,
        outputMetrics: result.metrics,
        apiBodyRaw: result.inputContext,
    };
}
