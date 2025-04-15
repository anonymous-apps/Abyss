import { dedent } from '../../utils/dedent/dedent';
import { ChatContextProps, ChatTurn, ImageMessagePartial, MessageSender, TextMessagePartial, ToolCallMessagePartial } from './types';

/**
 * @description Manages chat context between a user and bot, handling message turns and formatting
 */
export class ChatThread {
    private readonly turns: ChatTurn[];

    constructor(props: ChatContextProps = {}) {
        this.turns = props.turns || [];
    }

    //
    // Static factory methods
    //

    /**
     * @description Creates a chat context from an array of alternating text messages
     * @param messages Array of string messages, odd indexes are treated as user messages, even as bot messages
     */
    public static fromStrings(messages: string[] = []): ChatThread {
        const turns: ChatTurn[] = [];

        messages.forEach((message, index) => {
            const sender: MessageSender = index % 2 === 0 ? 'user' : 'bot';
            const textPartial: TextMessagePartial = {
                type: 'text',
                content: dedent(message).trim(),
            };

            turns.push({
                sender,
                partials: [textPartial],
            });
        });

        return new ChatThread({ turns });
    }

    //
    // Private utility methods
    //

    private _getLastTurn(): ChatTurn | undefined {
        return this.turns.length > 0 ? this.turns[this.turns.length - 1] : undefined;
    }

    private _createTextPartial(content: string): TextMessagePartial {
        return {
            type: 'text',
            content: dedent(content).trim(),
        };
    }

    private _createImagePartial(base64Data: string): ImageMessagePartial {
        return {
            type: 'image',
            base64Data,
        };
    }

    private _createToolCallPartial(params: Omit<ToolCallMessagePartial, 'type'>): ToolCallMessagePartial {
        return {
            type: 'toolCall',
            ...params,
        };
    }

    //
    // Public methods
    //

    /**
     * @description Adds a new turn to the chat context
     */
    public addTurn(turn: ChatTurn): ChatThread {
        const lastTurn = this._getLastTurn();

        // Ensure alternating turns between user and bot
        if (lastTurn && lastTurn.sender === turn.sender) {
            throw new Error(`Cannot add consecutive turns from the same sender: ${turn.sender}`);
        }

        return new ChatThread({ turns: [...this.turns, turn] });
    }

    /**
     * @description Adds a text message to the current turn or creates a new turn
     */
    public addTextMessage(text: string, sender: MessageSender): ChatThread {
        const lastTurn = this._getLastTurn();
        const textPartial = this._createTextPartial(text);

        // If no turns yet or if last turn was from the other sender, create a new turn
        if (!lastTurn || lastTurn.sender !== sender) {
            return this.addTurn({
                sender,
                partials: [textPartial],
            });
        }

        // Add to existing turn from the same sender
        const updatedTurns = [...this.turns];
        const lastTurnIndex = updatedTurns.length - 1;
        updatedTurns[lastTurnIndex] = {
            ...updatedTurns[lastTurnIndex],
            partials: [...updatedTurns[lastTurnIndex].partials, textPartial],
        };

        return new ChatThread({ turns: updatedTurns });
    }

    /**
     * @description Adds an image message to the current turn or creates a new turn
     */
    public addImageMessage(base64Data: string, sender: MessageSender): ChatThread {
        const lastTurn = this._getLastTurn();
        const imagePartial = this._createImagePartial(base64Data);

        // If no turns yet or if last turn was from the other sender, create a new turn
        if (!lastTurn || lastTurn.sender !== sender) {
            return this.addTurn({
                sender,
                partials: [imagePartial],
            });
        }

        // Add to existing turn from the same sender
        const updatedTurns = [...this.turns];
        const lastTurnIndex = updatedTurns.length - 1;
        updatedTurns[lastTurnIndex] = {
            ...updatedTurns[lastTurnIndex],
            partials: [...updatedTurns[lastTurnIndex].partials, imagePartial],
        };

        return new ChatThread({ turns: updatedTurns });
    }

    /**
     * @description Adds a tool call message to the current turn or creates a new turn
     */
    public addToolCallMessage(sender: MessageSender, params: Omit<ToolCallMessagePartial, 'type' | 'sender'>): ChatThread {
        const lastTurn = this._getLastTurn();
        const toolCallPartial = this._createToolCallPartial(params);

        // If no turns yet or if last turn was from the other sender, create a new turn
        if (!lastTurn || lastTurn.sender !== sender) {
            return this.addTurn({
                sender,
                partials: [toolCallPartial],
            });
        }

        // Add to existing turn from the same sender
        const updatedTurns = [...this.turns];
        const lastTurnIndex = updatedTurns.length - 1;
        updatedTurns[lastTurnIndex] = {
            ...updatedTurns[lastTurnIndex],
            partials: [...updatedTurns[lastTurnIndex].partials, toolCallPartial],
        };

        return new ChatThread({ turns: updatedTurns });
    }

    /**
     * @description Convenience method to add a user text message
     */
    public addUserTextMessage(text: string): ChatThread {
        return this.addTextMessage(text, 'user');
    }

    /**
     * @description Convenience method to add a bot text message
     */
    public addBotTextMessage(text: string): ChatThread {
        return this.addTextMessage(text, 'bot');
    }

    /**
     * @description Convenience method to add a user image message
     */
    public addUserImageMessage(base64Data: string): ChatThread {
        return this.addImageMessage(base64Data, 'user');
    }

    /**
     * @description Convenience method to add a bot image message
     */
    public addBotImageMessage(base64Data: string): ChatThread {
        return this.addImageMessage(base64Data, 'bot');
    }

    /**
     * @description Convenience method to add a bot tool call message
     */
    public addBotToolCallMessage(params: Omit<ToolCallMessagePartial, 'type' | 'sender'>): ChatThread {
        return this.addToolCallMessage('bot', params);
    }

    /**
     * @description Gets all turns in the chat context
     */
    public getTurns(): ChatTurn[] {
        return this.turns;
    }

    /**
     * @description Extracts all text content from the chat
     */
    public toString(): string {
        return this.turns
            .flatMap(turn =>
                turn.partials.filter(partial => partial.type === 'text').map(partial => (partial as TextMessagePartial).content)
            )
            .join('\n');
    }

    /**
     * @description Formats chat context for logging with sender information
     */
    public toLogString(): string {
        return this.turns
            .map(turn => {
                const partialLogs = turn.partials
                    .map(partial => {
                        if (partial.type === 'text') {
                            return (partial as TextMessagePartial).content;
                        } else if (partial.type === 'image') {
                            return `[IMAGE: ${(partial as ImageMessagePartial).base64Data.substring(0, 20)}...]`;
                        } else if (partial.type === 'toolCall') {
                            const toolCall = partial as ToolCallMessagePartial;
                            return `[TOOL CALL: ${toolCall.name}(${JSON.stringify(toolCall.args)})]`;
                        }
                        return '';
                    })
                    .join('\n\n');

                return `[${turn.sender}] --------------------------------\n${partialLogs}\n`;
            })
            .join('\n');
    }

    /**
     * @description Gets the last bot message text content
     * @returns The text content of the last bot message, or undefined if none exists
     */
    public getLastBotTextMessage(): string | undefined {
        // Iterate through turns in reverse to find the last bot turn
        for (let i = this.turns.length - 1; i >= 0; i--) {
            const turn = this.turns[i];
            if (turn.sender === 'bot') {
                // Find the last text partial in this turn
                for (let j = turn.partials.length - 1; j >= 0; j--) {
                    const partial = turn.partials[j];
                    if (partial.type === 'text') {
                        return (partial as TextMessagePartial).content;
                    }
                }
            }
        }
        return undefined;
    }

    /**
     * @description Gets the last bot message image content
     * @returns The base64 data of the last bot image, or undefined if none exists
     */
    public getLastBotImageMessage(): string | undefined {
        // Iterate through turns in reverse to find the last bot turn
        for (let i = this.turns.length - 1; i >= 0; i--) {
            const turn = this.turns[i];
            if (turn.sender === 'bot') {
                // Find the last image partial in this turn
                for (let j = turn.partials.length - 1; j >= 0; j--) {
                    const partial = turn.partials[j];
                    if (partial.type === 'image') {
                        return (partial as ImageMessagePartial).base64Data;
                    }
                }
            }
        }
        return undefined;
    }

    //
    // Saving and loading
    //

    public serialize(): string {
        return JSON.stringify({ turns: this.turns });
    }

    public static deserialize(serialized: string): ChatThread {
        const { turns } = JSON.parse(serialized);
        return new ChatThread({ turns });
    }
}
