import { MessageRecord } from '../../controllers/message';
import { ToolRecord } from '../../controllers/tool';

export interface InvokeSystemToolInput {
    message: MessageRecord;
    tool: ToolRecord;
}
