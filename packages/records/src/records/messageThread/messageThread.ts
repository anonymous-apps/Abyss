import { RecordClass } from '../recordClass';
import { MessageThreadController } from './messageThread.controller';
import { MessagePartial, MessageThreadType, MessageTurn } from './messageThread.type';

export class MessageThreadRecord extends RecordClass<MessageThreadType> {
    public turns: MessageTurn[];

    constructor(controller: MessageThreadController, data: MessageThreadType) {
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

        const data = await this.controller.create({
            turns: newTurns,
        });
        return data as unknown as MessageThreadRecord;
    }

    async addHumanPartial(...messages: MessagePartial[]): Promise<MessageThreadRecord> {
        return this.addPartial('HUMAN', ...messages);
    }
}
