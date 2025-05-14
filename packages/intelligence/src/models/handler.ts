import { ReferencedMessageThreadRecord, ReferencedModelConnectionRecord } from '@abyss/records';
import { parseLLMOutput } from '../parser/parser';
import { InvokeAnthropic } from './implementations/anthropic/handler';
import { InvokeStatic } from './implementations/static/handler';
import { buildConversationPrompt } from './prompts/buildConversationPrompt';
import { InvokeModelInternalResult } from './types';

export async function invokeModelAgainstThread(connectionRef: ReferencedModelConnectionRecord, thread: ReferencedMessageThreadRecord) {
    const modelResponse = await invokeLLM(connectionRef, thread);
    const parsedData = await parseLLMOutput(modelResponse.outputString);

    return { ...modelResponse, parsed: parsedData };
}

async function invokeLLM(
    connectionRef: ReferencedModelConnectionRecord,
    thread: ReferencedMessageThreadRecord
): Promise<InvokeModelInternalResult> {
    // Create log stream
    const connection = await connectionRef.get();
    const modelInvokeLogStream = await connectionRef.client.tables.logStream.new('modelInvoke', connectionRef.id);
    await modelInvokeLogStream.log('modelInvoke', 'Starting model invocation', {
        threadId: thread.id,
        connectionId: connectionRef.id,
        connectionProvider: connection.providerId,
        connectionModel: connection.modelId,
    });

    // Build conversation prompt
    const turns = await buildConversationPrompt(thread, thread.client);
    await modelInvokeLogStream.log('modelInvoke', 'Conversation prompt built', turns);

    // Invoke LLM
    try {
        if (connection.accessFormat.toLowerCase() === 'anthropic') {
            await modelInvokeLogStream.log('modelInvoke', 'Invoking Anthropic API handler');
            const anthropicResult = await InvokeAnthropic({
                logStream: modelInvokeLogStream,
                thread,
                modelId: connection.modelId,
                apiKey: connection.connectionData.apiKey,
            });
            await modelInvokeLogStream.log('modelInvoke', 'Anthropic API handler invoked', anthropicResult);
            modelInvokeLogStream.success();
            return { ...anthropicResult, logStream: modelInvokeLogStream };
        }
        if (connection.accessFormat.toLowerCase() === 'static') {
            await modelInvokeLogStream.log('modelInvoke', 'Invoking Static API handler');
            const staticResult = await InvokeStatic({
                thread,
                response: connection.connectionData.response,
            });
            await modelInvokeLogStream.log('modelInvoke', 'Static API handler invoked', staticResult);
            modelInvokeLogStream.success();
            return { ...staticResult, logStream: modelInvokeLogStream };
        }

        throw new Error(`Unknown AI access format: ${connection.accessFormat}`);
    } catch (error) {
        modelInvokeLogStream.error('modelInvoke', 'Error invoking LLM', { error });
        modelInvokeLogStream.fail();
        throw error;
    }
}
