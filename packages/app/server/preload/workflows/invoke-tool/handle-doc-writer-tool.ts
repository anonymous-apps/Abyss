import { DocumentController } from '../../controllers/document';
import { MessageController, MessageRecord, MessageToolCall } from '../../controllers/message';
import { TextLogController } from '../../controllers/text-log';
import { ToolInvocationController } from '../../controllers/tool-invocation';
import { InvokeDocumentWriterToolInput } from './types';

export async function handleInvokeDocumentWriterTool(input: InvokeDocumentWriterToolInput) {
    const { message, tool } = input;
    const toolCall = message as MessageRecord<MessageToolCall>;
    const parameters = toolCall.content.tool.parameters;

    // Setup call
    const log = await TextLogController.empty();
    const toolInvocation = await ToolInvocationController.create({
        toolId: tool.id,
        parameters,
        status: 'running',
        textLogId: log.id,
    });

    // Add message for tool call
    await MessageController.update(toolCall.id, {
        content: {
            ...toolCall.content,
            tool: {
                ...toolCall.content.tool,
                invocationId: toolInvocation.id,
            },
        },
    });

    // Create the document
    const document = await DocumentController.createNextVersion(parameters.sourceDocId, {
        title: parameters.title,
        text: parameters.body,
        type: parameters.docType,
    });

    if (parameters.sourceDocId) {
        await TextLogController.appendToLog(
            log.id,
            `
            Document ${parameters.sourceDocId} updated, forming a new document with id: ${document.id}
            Please use this new document id to reference the document going forward.
        `
        );
    } else {
        await TextLogController.appendToLog(
            log.id,
            `
            New Document created: ${document.id}
        `
        );
    }

    await ToolInvocationController.complete(toolInvocation.id);
}
