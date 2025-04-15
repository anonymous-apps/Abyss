import { MessageController, MessageRecord, MessageToolCall } from '../../controllers/message';
import { TextLogController } from '../../controllers/text-log';
import { ToolInvocationController } from '../../controllers/tool-invocation';
import { InvokeNodejsToolInput } from './types';
import { runCommandAtPath } from './utils';

export async function handleInvokeNodejsTool(input: InvokeNodejsToolInput) {
    const { message, tool } = input;
    const toolCall = message as MessageRecord<MessageToolCall>;
    const parameters = toolCall.content.tool.parameters;

    const log = await TextLogController.empty();

    const toolInvocation = await ToolInvocationController.create({
        toolId: tool.id,
        parameters,
        status: 'running',
        textLogId: log.id,
    });

    await MessageController.update(toolCall.id, {
        content: {
            ...toolCall.content,
            tool: {
                ...toolCall.content.tool,
                invocationId: toolInvocation.id,
            },
        },
    });

    // Get the workspace path from the result property
    const workspacePath = tool.data?.workspacePath;
    if (!workspacePath) {
        throw new Error('Workspace path not found in the tool data');
    }

    try {
        // Set the input as an environment variable
        const inputJson = JSON.stringify(parameters);

        // Run the tool
        await runCommandAtPath(`npm run build`, workspacePath);
        const startResult = await runCommandAtPath(`export INPUT='${inputJson}' && npm run start`, workspacePath);

        // Update the log with the result
        await TextLogController.appendToLog(log.id, startResult);

        // Complete the tool invocation
        await ToolInvocationController.complete(toolInvocation.id);
    } catch (error) {
        // Log the error
        await TextLogController.appendToLog(log.id, `\n\n Error: ${error}`);

        // Mark the tool invocation as failed
        await ToolInvocationController.error(toolInvocation.id);

        throw error;
    }
}
