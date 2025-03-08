import { dedent } from './dedent';

export interface ChatMessage {
    text: string;
    from: 'user' | 'bot';
}

export class ChatContext {
    // Message back and forth
    private messages: ChatMessage[];

    constructor(messages: ChatMessage[] = []) {
        // Process messages to add continue messages where needed
        const processedMessages: ChatMessage[] = [];
        messages.forEach((message, index) => {
            if (index > 0 && processedMessages[processedMessages.length - 1].from === message.from) {
                processedMessages.push({
                    text: 'continue',
                    from: message.from === 'user' ? 'bot' : 'user',
                });
            }
            processedMessages.push({
                ...message,
                text: dedent(message.text).trim(),
            });
        });
        this.messages = processedMessages;
    }

    public static fromStrings(messages: string[] = []): ChatContext {
        return new ChatContext(
            messages.map((message, index) => ({
                text: message,
                from: index % 2 === 0 ? 'user' : 'bot',
            }))
        );
    }

    addMessage(message: ChatMessage): ChatContext {
        const lastMessage = this.messages[this.messages.length - 1];
        const newMessages = [...this.messages];

        if (lastMessage && lastMessage.from === message.from) {
            newMessages.push({
                text: 'continue',
                from: message.from === 'user' ? 'bot' : 'user',
            });
        }

        newMessages.push(message);
        return new ChatContext(newMessages);
    }

    addUserMessage(text: string): ChatContext {
        return this.addMessage({
            text,
            from: 'user',
        });
    }

    addBotMessage(text: string): ChatContext {
        return this.addMessage({
            text,
            from: 'bot',
        });
    }

    getMessages(): ChatMessage[] {
        return this.messages;
    }

    toString(): string {
        return this.messages.map(message => message.text).join('\n');
    }

    toLogString(): string {
        return this.messages.map(message => `[${message.from}]  --------------------------------\n${message.text}\n`).join('\n');
    }
}
