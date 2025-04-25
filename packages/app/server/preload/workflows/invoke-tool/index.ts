import { MessageController } from '../../controllers/message';
import { MetricController } from '../../controllers/metric';
import { ToolController } from '../../controllers/tool';
import { handleInvokeDocumentWriterTool } from './handle-doc-writer-tool';
import { handleInvokeNodejsTool } from './handle-invoke-nodejs-tool';
import { handlerInvokeBuildNodejsTool } from './handler-build-nodejs-tool';
export async function InvokeToolFromMessage(messageId: string) {
    const message = await MessageController.getOrThrowByRecordId(messageId);
    console.log('message', message);
    if (!('toolRequest' in message.content)) {
        throw new Error('Message does not contain a tool');
    }

    const tool = await ToolController.findByShortId(message.content.toolRequest.shortId);
    if (!tool) {
        throw new Error('Tool not found: ' + message.content.toolRequest.shortId);
    }

    if (tool.type === 'BUILD-NODE-TOOL') {
        if (tool.name === 'Propose NodeJs Tool') {
            return MetricController.withMetrics('invoke-build-nodejs-tool', () => handlerInvokeBuildNodejsTool({ message, tool }), {
                toolName: tool.name,
            });
        }
    }

    if (tool.type === 'NodeJS') {
        return MetricController.withMetrics('invoke-nodejs-tool', () => handleInvokeNodejsTool({ message, tool }), {
            toolName: tool.name,
        });
    }

    if (tool.type === 'DOCUMENT-WRITER') {
        return MetricController.withMetrics('invoke-document-writer-tool', () => handleInvokeDocumentWriterTool({ message, tool }), {
            toolName: tool.name,
        });
    }

    throw new Error('Unsupported tool type: ' + tool.type);
}
``;
