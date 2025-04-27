import { DataInterface } from '../data-interface';
import { DatabaseObject } from '../data-interface.types';
import { MessageSender, ThreadMessagePartial, ThreadProps, ThreadTurn } from './types';

export class Thread extends DatabaseObject {
    private readonly turns: ThreadTurn[];

    public static async new(db: DataInterface, props: ThreadProps = {}): Promise<Thread> {
        const thread = new Thread(db, props);
        await db.saveThread(thread);
        return thread;
    }

    public static async fromId(db: DataInterface, id: string): Promise<Thread> {
        const thread = await db.loadThread(id);
        return thread;
    }

    private constructor(db: DataInterface, props?: ThreadProps) {
        super('thread', db, props?.id);
        this.turns = props?.turns ?? [];
    }

    //
    // Getters
    //

    public getTurns(): ThreadTurn[] {
        return this.turns;
    }

    public getLastTurn(): ThreadTurn {
        return this._getLastTurn();
    }

    //
    // Utility methods
    //

    private _getLastTurn(): ThreadTurn {
        return this.turns[this.turns.length - 1];
    }

    private _getLastSender(): MessageSender {
        return this._getLastTurn().sender;
    }

    //
    // Public modification methods
    //

    public async addTurn(turn: ThreadTurn): Promise<Thread> {
        return Thread.new(this.db, { id: this.id, turns: [...this.turns, turn] });
    }

    public async partialToTurn(...partials: ThreadMessagePartial[]): Promise<Thread> {
        const lastTurn = this._getLastTurn();
        const newLastTurn = { ...lastTurn, partials: [...lastTurn.partials, ...partials] };
        return Thread.new(this.db, { id: this.id, turns: [...this.turns.slice(0, -1), newLastTurn] });
    }

    public async addPartialWithSender(sender: MessageSender, ...partials: ThreadMessagePartial[]): Promise<Thread> {
        if (this.turns.length === 0) {
            return this.addTurn({ sender, partials });
        }
        const lastSender = this._getLastSender();
        if (lastSender !== sender) {
            return this.addTurn({ sender, partials });
        }
        return this.partialToTurn(...partials);
    }
}
