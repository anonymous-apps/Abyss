import { v4 } from 'uuid';
import { LanguageModel } from '../../models/language-model';
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
}

export class StreamedChatResponse {
    public readonly model: LanguageModel;
    public readonly inputThread: ChatThread;

    private messages: Message[] = [];
    private currentMessage: Message | null = null;
    private fullTextMessage: string = '';

    // Event listeners
    private newMessageListeners: MessageEventCallback[] = [];
    private newTextMessageListeners: TextMessageEventCallback[] = [];
    private newImageMessageListeners: ImageMessageEventCallback[] = [];
    private newToolCallListeners: ToolCallEventCallback[] = [];
    private toolCallUpdatedListeners: ToolCallEventCallback[] = [];
    private toolCallCompletedListeners: ToolCallEventCallback[] = [];
    private completeListeners: (() => void)[] = [];

    constructor(props: Props) {
        this.model = props.model;
        this.inputThread = props.inputThread;
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
            content: '',
            completed: false,
        };
        this.emitNewTextMessage(this.currentMessage as TextMessage);
    }

    public addTextToCurrentTextMessage(text: string): void {
        if (!this.currentMessage || this.currentMessage.type !== 'text') {
            this.startNewTextMessage();
        }

        if (this.currentMessage && this.currentMessage.type === 'text') {
            this.currentMessage.content += text;
            this.emitNewTextMessage(this.currentMessage);
        }
    }

    public startNewImageMessage(): void {
        this.completeCurrentMessage();
        this.currentMessage = {
            type: 'image',
            base64Data: '',
            completed: false,
        };
        this.emitNewImageMessage(this.currentMessage as ImageMessage);
    }

    public setImageData(base64Data: string): void {
        if (this.currentMessage && this.currentMessage.type === 'image') {
            this.currentMessage.base64Data = base64Data;
            this.emitNewImageMessage(this.currentMessage);
        }
    }

    public startNewToolCall(name: string): void {
        this.completeCurrentMessage();
        const callId = v4();
        this.currentMessage = {
            type: 'toolCall',
            callId,
            name,
            arguments: {},
            completed: false,
        };
        this.emitNewToolCall(this.currentMessage as ToolCallMessage);
    }

    public setToolCallArguments(args: Record<string, any>): void {
        if (this.currentMessage && this.currentMessage.type === 'toolCall') {
            this.currentMessage.arguments = args;
            this.emitToolCallUpdated(this.currentMessage as ToolCallMessage);
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

            this.emitToolCallUpdated(this.currentMessage as ToolCallMessage);
        }
    }

    private completeCurrentMessage(): void {
        if (!this.currentMessage || this.currentMessage.completed) {
            return;
        }

        this.currentMessage.completed = true;
        this.messages.push(this.currentMessage);
        this.emitNewMessage(this.currentMessage);

        if (this.currentMessage.type === 'toolCall') {
            this.emitToolCallCompleted(this.currentMessage as ToolCallMessage);
        }

        this.currentMessage = null;
    }

    // Finalize the current message and mark the response as complete
    public complete(): void {
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

    // Event emitter methods
    private emitNewMessage(message: Message): void {
        for (const listener of this.newMessageListeners) {
            listener(message);
        }
    }

    private emitNewTextMessage(message: TextMessage): void {
        for (const listener of this.newTextMessageListeners) {
            listener(message);
        }
    }

    private emitNewImageMessage(message: ImageMessage): void {
        for (const listener of this.newImageMessageListeners) {
            listener(message);
        }
    }

    private emitNewToolCall(toolCall: ToolCallMessage): void {
        for (const listener of this.newToolCallListeners) {
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
    public onNewMessage(callback: MessageEventCallback): () => void {
        this.newMessageListeners.push(callback);
        return () => {
            this.newMessageListeners = this.newMessageListeners.filter(cb => cb !== callback);
        };
    }

    public onNewTextMessage(callback: TextMessageEventCallback): () => void {
        this.newTextMessageListeners.push(callback);
        return () => {
            this.newTextMessageListeners = this.newTextMessageListeners.filter(cb => cb !== callback);
        };
    }

    public onNewImageMessage(callback: ImageMessageEventCallback): () => void {
        this.newImageMessageListeners.push(callback);
        return () => {
            this.newImageMessageListeners = this.newImageMessageListeners.filter(cb => cb !== callback);
        };
    }

    public onNewToolCall(callback: ToolCallEventCallback): () => void {
        this.newToolCallListeners.push(callback);
        return () => {
            this.newToolCallListeners = this.newToolCallListeners.filter(cb => cb !== callback);
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
}
