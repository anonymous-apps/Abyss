import { ChatContext } from '../../src/utils/chat-context';
import { snapshot } from './snapshot.test';

describe('ChatContext', () => {
    describe('constructor', () => {
        it('should create an empty context', () => {
            const context = new ChatContext();
            expect(context.getMessages()).toHaveLength(0);
        });

        it('should create a context with initial messages', () => {
            const messages = [
                { text: 'Hello', from: 'user' as const },
                { text: 'Hi there', from: 'bot' as const },
            ];
            const context = new ChatContext(messages);
            expect(context.getMessages()).toEqual(messages);
        });

        it('should dedent messages on creation', () => {
            const context = new ChatContext([
                {
                    text: `
                    indented text
                        more indented
                `,
                    from: 'user' as const,
                },
            ]);
            expect(context.getMessages()[0].text).toBe('indented text\n    more indented');
        });
    });

    describe('fromStrings', () => {
        it('should create context from string array', () => {
            const strings = ['user message', 'bot message', 'another user message'];
            const context = ChatContext.fromStrings(strings);
            expect(context.getMessages()).toEqual([
                { text: 'user message', from: 'user' },
                { text: 'bot message', from: 'bot' },
                { text: 'another user message', from: 'user' },
            ]);
        });

        it('should create empty context when no strings provided', () => {
            const context = ChatContext.fromStrings();
            expect(context.getMessages()).toHaveLength(0);
        });
    });

    describe('message manipulation', () => {
        it('should add user message', () => {
            const context = new ChatContext().addUserMessage('Hello');
            expect(context.getMessages()).toEqual([{ text: 'Hello', from: 'user' }]);
        });

        it('should add bot message', () => {
            const context = new ChatContext().addBotMessage('Hi there');
            expect(context.getMessages()).toEqual([{ text: 'Hi there', from: 'bot' }]);
        });

        it('should add continue message between consecutive user messages', () => {
            const context = new ChatContext().addUserMessage('First message').addUserMessage('Second message');

            expect(context.getMessages()).toEqual([
                { text: 'First message', from: 'user' },
                { text: 'continue', from: 'bot' },
                { text: 'Second message', from: 'user' },
            ]);
        });

        it('should add continue message between consecutive bot messages', () => {
            const context = new ChatContext().addBotMessage('First response').addBotMessage('Second response');

            expect(context.getMessages()).toEqual([
                { text: 'First response', from: 'bot' },
                { text: 'continue', from: 'user' },
                { text: 'Second response', from: 'bot' },
            ]);
        });

        it('should handle multiple consecutive messages with continues', () => {
            const context = new ChatContext()
                .addUserMessage('User 1')
                .addUserMessage('User 2')
                .addBotMessage('Bot 1')
                .addBotMessage('Bot 2')
                .addUserMessage('User 3');

            expect(context.getMessages()).toEqual([
                { text: 'User 1', from: 'user' },
                { text: 'continue', from: 'bot' },
                { text: 'User 2', from: 'user' },
                { text: 'Bot 1', from: 'bot' },
                { text: 'continue', from: 'user' },
                { text: 'Bot 2', from: 'bot' },
                { text: 'User 3', from: 'user' },
            ]);
            snapshot(context.toLogString());
        });

        it('should add continue messages when initializing with consecutive messages', () => {
            const messages = [
                { text: 'First user', from: 'user' as const },
                { text: 'Second user', from: 'user' as const },
                { text: 'Bot response', from: 'bot' as const },
            ];

            const context = new ChatContext(messages);
            expect(context.getMessages()).toEqual([
                { text: 'First user', from: 'user' },
                { text: 'continue', from: 'bot' },
                { text: 'Second user', from: 'user' },
                { text: 'Bot response', from: 'bot' },
            ]);
        });

        it('should add generic message', () => {
            const context = new ChatContext().addMessage({ text: 'Hello', from: 'user' });
            expect(context.getMessages()).toEqual([{ text: 'Hello', from: 'user' }]);
        });

        it('should maintain immutability when adding messages', () => {
            const context1 = new ChatContext();
            const context2 = context1.addUserMessage('Hello');

            expect(context1.getMessages()).toHaveLength(0);
            expect(context2.getMessages()).toHaveLength(1);
        });
    });

    describe('string conversion', () => {
        it('should convert to string', () => {
            const context = new ChatContext([
                { text: 'Hello', from: 'user' },
                { text: 'Hi there', from: 'bot' },
            ]);
            expect(context.toString()).toBe('Hello\nHi there');
        });

        it('should convert to log string', () => {
            const context = new ChatContext().addUserMessage('Hello').addBotMessage('Hi there');
            snapshot(context.toLogString());
        });
    });
});
