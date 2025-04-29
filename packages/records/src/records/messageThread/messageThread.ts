import { RecordClass } from '../recordClass';
import { MessageThreadController } from './messageThread.controller';
import { MessagePartial, MessageThread, MessageTurn } from './messageThread.type';

export class MessageThreadRecord extends RecordClass<MessageThread> {
    turns: MessageTurn[];

    constructor(controller: MessageThreadController, data: MessageThread) {
        super(controller, data);
        this.turns = data.turns;
    }

    /**
     * Adds a new partial message to the thread, creating a new turn if needed.
     * This is an immutable operation that returns a new MessageThreadRecord.
     */
    async addPartial(senderId: string, message: MessagePartial): Promise<MessageThreadRecord> {
        const currentTurn = this.turns[this.turns.length - 1];

        // If there's no current turn or the current turn has a different sender,
        // create a new turn
        const newTurns = [...this.turns];
        if (!currentTurn || currentTurn.senderId !== senderId) {
            newTurns.push({
                id: crypto.randomUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
                senderId,
                partials: [message],
            });
        } else {
            // Add to existing turn
            newTurns[newTurns.length - 1] = {
                ...currentTurn,
                updatedAt: new Date(),
                partials: [...currentTurn.partials, message],
            };
        }

        const record = await this.controller.create({
            turns: newTurns,
        });
        return new MessageThreadRecord(this.controller, record);
    }
}
