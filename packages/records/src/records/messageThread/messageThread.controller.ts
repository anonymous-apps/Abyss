import { PrismaConnection } from '../../prisma';
import { RecordController } from '../recordController';
import { MessageThreadRecord } from './messageThread';
import { MessageThreadType } from './messageThread.type';

export class MessageThreadController extends RecordController<MessageThreadType, MessageThreadRecord> {
    constructor(connection: PrismaConnection) {
        super(
            'messageThread',
            'An immutable collection of messages between two participants',
            connection,
            (data: any) => new MessageThreadRecord(this, data)
        );
    }
}
