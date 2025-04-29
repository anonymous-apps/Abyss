import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { ChatThreadRecord } from './chatThread';
import { ChatThreadType } from './chatThread.type';

export class ChatThreadController extends RecordController<ChatThreadType> {
    constructor(connection: PrismaConnection) {
        super('chatThread', connection, data => new ChatThreadRecord(this, data));
    }
}
