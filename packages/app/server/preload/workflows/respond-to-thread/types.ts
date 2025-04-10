import { ChatRecord } from '../../controllers/chat';
import { MessageRecord } from '../../controllers/message';
import { MessageThreadRecord } from '../../controllers/message-thread';
import { ModelConnectionsRecord } from '../../controllers/model-connections';

export interface AskRawModelToRespondToThreadInput {
    chat: ChatRecord;
    thread: MessageThreadRecord;
    messages: MessageRecord[];
    connection: ModelConnectionsRecord;
}
