import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { MessageThreadRecord } from './messageThread';
import { MessageThread } from './messageThread.type';

export class MessageThreadController extends RecordController<MessageThread> {
    constructor(connection: PrismaConnection) {
        super('messageThread', connection, (data: any) => new MessageThreadRecord(this, data));
    }
}
