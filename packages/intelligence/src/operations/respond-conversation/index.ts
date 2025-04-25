import { parseString } from '../../parser/parser';
import { Log } from '../../utils/logs';
import { buildToolUsePrompt } from './prompts';
import { AskWithToolCallsOptions } from './types';

export * from './errors';
export * from './types';

export async function generateWithTools(options: AskWithToolCallsOptions) {
    const { model, thread } = options;
    Log.log('generateWithTools', `Generating with tools against model ${model.getName()}`);

    // Build the tool calls string
    const toolsInThread = thread.getListOfCurrentTools();
    const threadWithToolCalls = buildToolUsePrompt(thread, toolsInThread);

    // Call model to get response
    Log.log('generateWithTools', `Getting response from model ${model.getName()} . . .`);
    const result = await model.invoke(threadWithToolCalls);

    // Parse the response to extract tool calls
    const messages = parseString(result.response);
    const resultThread = thread.addPartialWithSender('bot', ...messages);

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
