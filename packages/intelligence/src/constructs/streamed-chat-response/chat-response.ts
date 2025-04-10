import { v4 } from 'uuid';
import { LanguageModel } from '../../models/language-model';
import { Log } from '../../utils/logs';
import { ChatThread } from '../chat-thread/chat-thread';
import {
    ImageMessage,
    ImageMessageEventCallback,
    Message,
    MessageEventCallback,
    TextMessage,
    TextMessageEventCallback,
    ToolCallEventCallback,
    ToolCallMessage,
} from './chat-response.types';

interface Props {
    model: LanguageModel;
    inputThread: ChatThread;
    batchingConstant?: number; // Time in ms to wait before flushing events
}

export class StreamedChatResponse {
    public readonly model: LanguageModel;
    public readonly inputThread: ChatThread;
    private readonly batchingConstant: number;

    private messages: Message[] = [];
    private currentMessage: Message | null = null;
    private fullTextMessage: string = '';

    // Event listeners
    private messageListeners: MessageEventCallback[] = [];
    private textMessageListeners: TextMessageEventCallback[] = [];
    private imageMessageListeners: ImageMessageEventCallback[] = [];
    private toolCallListeners: ToolCallEventCallback[] = [];
    private toolCallUpdatedListeners: ToolCallEventCallback[] = [];
    private toolCallCompletedListeners: ToolCallEventCallback[] = [];
    private completeListeners: (() => void)[] = [];

    // Batching mechanism
    private batchingTimeouts: Map<string, NodeJS.Timeout> = new Map();
    private pendingMessages: Map<string, Message> = new Map();

    constructor(props: Props) {
        this.model = props.model;
        this.inputThread = props.inputThread;
        this.batchingConstant = props.batchingConstant || 100; // Default to 100ms if not specified
    }

    // Text management methods
    public addText(text: string): void {
        this.fullTextMessage += text;
    }

    public getRawOutput(): string {
        return this.fullTextMessage;
    }

    // Message management methods
    public startNewTextMessage(): void {
        this.completeCurrentMessage();
        this.currentMessage = {
            type: 'text',
            uuid: v4(),
            content: '',
            completed: false,
        };
        this.scheduleMessageUpdate(this.currentMessage);
    }

    public addTextToCurrentTextMessage(text: string): void {
        if (!this.currentMessage || this.currentMessage.type !== 'text') {
            this.startNewTextMessage();
        }

        if (this.currentMessage && this.currentMessage.type === 'text') {
            this.currentMessage.content += text;
            this.scheduleMessageUpdate(this.currentMessage);
        }
    }

    public startNewImageMessage(): void {
        this.completeCurrentMessage();
        this.currentMessage = {
            type: 'image',
            uuid: v4(),
            base64Data: '',
            completed: false,
        };
        this.scheduleMessageUpdate(this.currentMessage);
    }

    public setImageData(base64Data: string): void {
        if (this.currentMessage && this.currentMessage.type === 'image') {
            this.currentMessage.base64Data = base64Data;
            this.scheduleMessageUpdate(this.currentMessage);
        }
    }

    public startNewToolCall(name: string): void {
        this.completeCurrentMessage();
        const callId = v4();
        this.currentMessage = {
            type: 'toolCall',
            uuid: v4(),
            callId,
            name,
            arguments: {},
            completed: false,
        };
        this.scheduleMessageUpdate(this.currentMessage);
    }

    public setToolCallArguments(args: Record<string, any>): void {
        if (this.currentMessage && this.currentMessage.type === 'toolCall') {
            this.currentMessage.arguments = args;
            this.scheduleMessageUpdate(this.currentMessage);
        }
    }

    public updateToolCall(keypath: string, value: string): void {
        if (this.currentMessage && this.currentMessage.type === 'toolCall') {
            const keys = keypath.split('.');
            let current: any = this.currentMessage.arguments;

            // Navigate to the nested object where we need to update
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (!current[key] || typeof current[key] !== 'object') {
                    current[key] = {};
                }
                current = current[key];
            }

            // Update the value at the final key
            const lastKey = keys[keys.length - 1];
            if (typeof current[lastKey] === 'string') {
                current[lastKey] += value;
            } else {
                current[lastKey] = value;
            }

            this.scheduleMessageUpdate(this.currentMessage);
        }
    }

    private completeCurrentMessage(): void {
        if (!this.currentMessage || this.currentMessage.completed) {
            return;
        }

        this.currentMessage.completed = true;
        this.messages.push(this.currentMessage);

        // Flush the message immediately when it's completed
        this.flushMessage(this.currentMessage);

        if (this.currentMessage.type === 'toolCall') {
            this.emitToolCallCompleted(this.currentMessage as ToolCallMessage);
        }

        this.currentMessage = null;
    }

    // Finalize the current message and mark the response as complete
    public complete(): void {
        Log.debug(this.model.getName(), 'Completing stream');
        this.completeCurrentMessage();
        this.emitComplete();
    }

    // Get all messages
    public getMessages(): Message[] {
        return [...this.messages];
    }

    // Get tool call by ID
    public getToolCallById(callId: string): ToolCallMessage | undefined {
        return this.messages.filter((msg): msg is ToolCallMessage => msg.type === 'toolCall').find(toolCall => toolCall.callId === callId);
    }

    // Batching mechanism methods
    private scheduleMessageUpdate(message: Message): void {
        // Store the latest version of the message
        this.pendingMessages.set(message.uuid, message);

        // Clear any existing timeout for this message
        if (this.batchingTimeouts.has(message.uuid)) {
            clearTimeout(this.batchingTimeouts.get(message.uuid)!);
            this.batchingTimeouts.delete(message.uuid);
        }

        // Set a new timeout to flush this message
        const timeout = setTimeout(() => {
            this.flushMessage(message);
        }, this.batchingConstant);

        this.batchingTimeouts.set(message.uuid, timeout);
    }

    private flushMessage(message: Message): void {
        // Remove the timeout if it exists
        if (this.batchingTimeouts.has(message.uuid)) {
            clearTimeout(this.batchingTimeouts.get(message.uuid)!);
            this.batchingTimeouts.delete(message.uuid);
        }

        // Get the latest version of the message
        const latestMessage = this.pendingMessages.get(message.uuid) || message;

        // Remove from pending
        this.pendingMessages.delete(message.uuid);

        // Emit the appropriate event based on message type
        if (latestMessage.type === 'text') {
            this.emitTextMessageUpdate(latestMessage as TextMessage);
        } else if (latestMessage.type === 'image') {
            this.emitImageMessageUpdate(latestMessage as ImageMessage);
        } else if (latestMessage.type === 'toolCall') {
            this.emitToolCallUpdate(latestMessage as ToolCallMessage);
        }
    }

    // Event emitter methods
    private emitMessage(message: Message): void {
        for (const listener of this.messageListeners) {
            listener(message);
        }
    }

    private emitTextMessageUpdate(message: TextMessage): void {
        for (const listener of this.textMessageListeners) {
            listener(message);
        }
    }

    private emitImageMessageUpdate(message: ImageMessage): void {
        for (const listener of this.imageMessageListeners) {
            listener(message);
        }
    }

    private emitToolCallUpdate(toolCall: ToolCallMessage): void {
        for (const listener of this.toolCallListeners) {
            listener(toolCall);
        }
    }

    private emitToolCallUpdated(toolCall: ToolCallMessage): void {
        for (const listener of this.toolCallUpdatedListeners) {
            listener(toolCall);
        }
    }

    private emitToolCallCompleted(toolCall: ToolCallMessage): void {
        for (const listener of this.toolCallCompletedListeners) {
            listener(toolCall);
        }
    }

    private emitComplete(): void {
        for (const listener of this.completeListeners) {
            listener();
        }
    }

    // Event listener registration methods
    public onMessage(callback: MessageEventCallback): () => void {
        this.messageListeners.push(callback);
        return () => {
            this.messageListeners = this.messageListeners.filter(cb => cb !== callback);
        };
    }

    public onTextMessageUpdate(callback: TextMessageEventCallback): () => void {
        this.textMessageListeners.push(callback);
        return () => {
            this.textMessageListeners = this.textMessageListeners.filter(cb => cb !== callback);
        };
    }

    public onImageMessageUpdate(callback: ImageMessageEventCallback): () => void {
        this.imageMessageListeners.push(callback);
        return () => {
            this.imageMessageListeners = this.imageMessageListeners.filter(cb => cb !== callback);
        };
    }

    public onToolCallUpdate(callback: ToolCallEventCallback): () => void {
        this.toolCallListeners.push(callback);
        return () => {
            this.toolCallListeners = this.toolCallListeners.filter(cb => cb !== callback);
        };
    }

    public onToolCallUpdated(callback: ToolCallEventCallback): () => void {
        this.toolCallUpdatedListeners.push(callback);
        return () => {
            this.toolCallUpdatedListeners = this.toolCallUpdatedListeners.filter(cb => cb !== callback);
        };
    }

    public onToolCallCompleted(callback: ToolCallEventCallback): () => void {
        this.toolCallCompletedListeners.push(callback);
        return () => {
            this.toolCallCompletedListeners = this.toolCallCompletedListeners.filter(cb => cb !== callback);
        };
    }

    public onComplete(callback: () => void): () => void {
        this.completeListeners.push(callback);
        return () => {
            this.completeListeners = this.completeListeners.filter(cb => cb !== callback);
        };
    }

    /**
     * Returns a Promise that resolves when the stream is complete.
     * This is useful for consumers who want to wait for the entire stream to finish.
     */
    public waitForCompletion(): Promise<void> {
        return new Promise<void>(resolve => {
            // If the stream is already complete, resolve immediately
            if (this.currentMessage === null && this.messages.length > 0) {
                resolve();
                return;
            }

            // Otherwise, add a one-time listener that will resolve the promise
            const unsubscribe = this.onComplete(() => {
                unsubscribe();
                resolve();
            });
        });
    }
}
