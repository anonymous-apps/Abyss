import { ToolDefinition } from '../../operations/respond-conversation/types';
import { getExposedToolsInThread } from './operations/getExposedToolsInThread';
import { getToolMessageDelta } from './operations/getToolMessageDelta';
import { ChatContextProps, ChatMessagePartial, ChatTurn, MessageSender } from './types';

export class ChatThread {
    private readonly turns: ChatTurn[];

    public static empty(): ChatThread {
        return new ChatThread({ turns: [] });
    }

    private constructor(props: ChatContextProps = {}) {
        this.turns = props.turns || [];
    }

    //
    // Getters
    //

    public getTurns(): ChatTurn[] {
        return this.turns;
    }

    public getLastTurn(): ChatTurn {
        return this._getLastTurn();
    }

    //
    // Utility methods
    //

    private _getLastTurn(): ChatTurn {
        return this.turns[this.turns.length - 1];
    }

    private _getLastSender(): MessageSender {
        return this._getLastTurn().sender;
    }

    //
    // Public modification methods
    //

    public addTurn(turn: ChatTurn): ChatThread {
        return new ChatThread({ turns: [...this.turns, turn] });
    }

    public partialToTurn(...partials: ChatMessagePartial[]): ChatThread {
        const lastTurn = this._getLastTurn();
        const newLastTurn = { ...lastTurn, partials: [...lastTurn.partials, ...partials] };
        return new ChatThread({ turns: [...this.turns.slice(0, -1), newLastTurn] });
    }

    public addPartialWithSender(sender: MessageSender, ...partials: ChatMessagePartial[]): ChatThread {
        if (this.turns.length === 0) {
            return this.addTurn({ sender, partials });
        }
        const lastSender = this._getLastSender();
        if (lastSender !== sender) {
            return this.addTurn({ sender, partials });
        }
        return this.partialToTurn(...partials);
    }

    //
    // Operations
    //

    public getListOfCurrentTools(): ToolDefinition[] {
        return getExposedToolsInThread(this);
    }

    public setCurrentTools(expectedTools: ToolDefinition[]) {
        return getToolMessageDelta(this, expectedTools);
    }

    //
    // Saving and loading
    //

    public save(): string {
        return JSON.stringify({ turns: this.turns });
    }

    public static load(serialized: string): ChatThread {
        const { turns } = JSON.parse(serialized);
        return new ChatThread({ turns });
    }
}
