import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { ChatThreadClass } from './chatThread';
import { ChatThread } from './chatThread.type';

export class ChatThreadController extends RecordController<ChatThread> {
    constructor(connection: PrismaConnection) {
        super('chatThread', connection, data => new ChatThreadClass(this, data));
    }
}
