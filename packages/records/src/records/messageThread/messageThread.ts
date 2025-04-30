import { ReferencedDatabaseRecord } from '../recordClass';
import { MessageThreadController } from './messageThread.controller';
import { MessagePartial, MessageThreadType } from './messageThread.type';

export class MessageThreadRecord extends ReferencedDatabaseRecord<MessageThreadType> {
    constructor(controller: MessageThreadController, id: string) {
        super(controller, id);
    }

    async addPartial(senderId: string, ...messages: Omit<MessagePartial, 'timestamp'>[]): Promise<MessageThreadRecord> {
        const data = await this.getOrThrow();
        const currentTurns = data.turns ?? [];
        const currentTurn = currentTurns[currentTurns.length - 1];
        const mappedMessages = messages.map(message => ({ ...message, timestamp: new Date() })) as MessagePartial[];

        const newTurns = [...currentTurns];
        if (!currentTurn || currentTurn.senderId !== senderId) {
            newTurns.push({
                id: crypto.randomUUID(),
                createdAt: new Date(),
                updatedAt: new Date(),
                senderId,
                partials: mappedMessages,
            });
        } else {
            newTurns[newTurns.length - 1] = {
                ...currentTurn,
                updatedAt: new Date(),
                partials: [...currentTurn.partials, ...mappedMessages],
            };
        }

        const updatedData = await this.controller.create({
            turns: newTurns,
        });
        return updatedData as unknown as MessageThreadRecord;
    }

    async addHumanPartial(...messages: MessagePartial[]): Promise<MessageThreadRecord> {
        return this.addPartial('HUMAN', ...messages);
    }
}
