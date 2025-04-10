import { MessageController } from '../../controllers/message';
import { ToolController } from '../../controllers/tool';
import { handlerInvokeSystemTool } from './handler-system-nodejs-tool-builder';

export async function InvokeToolFromMessage(messageId: string) {
    const message = await MessageController.getOrThrowByRecordId(messageId);
    if (!('tool' in message.content)) {
        throw new Error('Message does not contain a tool');
    }

    if (!message.references?.toolSourceId) {
        throw new Error('Message does not contain a tool source id');
    }
    const tool = await ToolController.getOrThrowByRecordId(message.references.toolSourceId);

    if (tool.type === 'SYSTEM') {
        if (tool.name === 'Propose NodeJs Tool') {
            return handlerInvokeSystemTool({ message, tool });
        }
    }

    throw new Error('Unsupported tool type: ' + tool.type);
}
