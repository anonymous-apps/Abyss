import { MessageController } from '../../controllers/message';
import { ToolController } from '../../controllers/tool';
import { handleInvokeNodejsTool } from './handle-invoke-nodejs-tool';
import { handlerInvokeBuildNodejsTool } from './handler-build-nodejs-tool';

export async function InvokeToolFromMessage(messageId: string) {
    const message = await MessageController.getOrThrowByRecordId(messageId);
    if (!('tool' in message.content)) {
        throw new Error('Message does not contain a tool');
    }

    if (!message.references?.toolSourceId) {
        throw new Error('Message does not contain a tool source id');
    }
    const tool = await ToolController.getOrThrowByRecordId(message.references.toolSourceId);

    if (tool.type === 'BUILD-NODE-TOOL') {
        if (tool.name === 'Propose NodeJs Tool') {
            return handlerInvokeBuildNodejsTool({ message, tool });
        }
    }

    if (tool.type === 'NodeJS') {
        return handleInvokeNodejsTool({ message, tool });
    }

    throw new Error('Unsupported tool type: ' + tool.type);
}
