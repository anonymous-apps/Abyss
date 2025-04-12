import { MessageRecord } from '../../controllers/message';
import { ToolRecord } from '../../controllers/tool';

export interface InvokeBuildNodejsToolInput {
    message: MessageRecord;
    tool: ToolRecord;
}

export interface InvokeNodejsToolInput {
    message: MessageRecord;
    tool: ToolRecord;
}
