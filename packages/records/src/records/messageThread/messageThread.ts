import { RecordClass } from '../recordClass';
import { MessageThreadController } from './messageThread.controller';
import { MessagePartial, MessageThread, MessageTurn } from './messageThread.type';

export class MessageThreadRecord extends RecordClass<MessageThread> {
    public static HUMAN = 'human';

    turns: MessageTurn[];

    constructor(controller: MessageThreadController, data: MessageThread) {
        super(controller, data);
        this.turns = data.turns;
    }

    async addPartial(senderId: string, ...messages: MessagePartial[]): Promise<MessageThreadRecord> {
        const currentTurn = this.turns[this.turns.length - 1];

        const newTurns = [...this.turns];
        if (!currentTurn || currentTurn.senderId !== senderId) {
            newTurns.push({
                id: crypto.randomUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
                senderId,
                partials: messages,
            });
        } else {
            newTurns[newTurns.length - 1] = {
                ...currentTurn,
                updatedAt: new Date(),
                partials: [...currentTurn.partials, ...messages],
            };
        }

        const record = await this.controller.create({
            turns: newTurns,
        });
        return new MessageThreadRecord(this.controller, record);
    }
}
