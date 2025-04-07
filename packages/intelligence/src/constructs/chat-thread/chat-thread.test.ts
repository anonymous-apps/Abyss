import { describe, expect, it } from "vitest";
import { ChatThread } from "./chat-thread";
import { ChatTurn } from "./types";

describe("ChatContext", () => {
    describe("constructor", () => {
        it("[Happy] should initialize with empty turns", () => {
            const context = new ChatThread();
            expect(context.getTurns()).toEqual([]);
        });

        it("[Happy] should initialize with provided turns", () => {
            const turns: ChatTurn[] = [
                {
                    sender: "user",
                    partials: [{ type: "text", content: "Hello" }],
                },
            ];

            const context = new ChatThread({ turns });
            expect(context.getTurns()).toEqual(turns);
        });
    });

    describe("fromStrings", () => {
        it("[Happy] should create a chat context from strings", () => {
            const strings = ["User message 1", "Bot message 1", "User message 2"];
            const context = ChatThread.fromStrings(strings);

            const turns = context.getTurns();
            expect(turns.length).toBe(3);
            expect(turns[0]).toEqual({
                sender: "user",
                partials: [{ type: "text", content: "User message 1" }],
            });
            expect(turns[1]).toEqual({
                sender: "bot",
                partials: [{ type: "text", content: "Bot message 1" }],
            });
            expect(turns[2]).toEqual({
                sender: "user",
                partials: [{ type: "text", content: "User message 2" }],
            });
        });

        it("[Edge] should handle empty strings array", () => {
            const context = ChatThread.fromStrings([]);
            expect(context.getTurns()).toEqual([]);
        });
    });

    describe("addTurn", () => {
        it("[Happy] should add a turn to the chat context", () => {
            const context = new ChatThread();
            const turn: ChatTurn = {
                sender: "user",
                partials: [{ type: "text", content: "Hello" }],
            };

            const newContext = context.addTurn(turn);
            expect(newContext.getTurns().length).toBe(1);
            expect(newContext.getTurns()[0]).toEqual(turn);
        });

        it("[Happy] should add alternating turns", () => {
            const context = new ChatThread();
            const userTurn: ChatTurn = {
                sender: "user",
                partials: [{ type: "text", content: "Hello" }],
            };

            const botTurn: ChatTurn = {
                sender: "bot",
                partials: [{ type: "text", content: "Hi there" }],
            };

            const withUserTurn = context.addTurn(userTurn);
            const withBothTurns = withUserTurn.addTurn(botTurn);

            expect(withBothTurns.getTurns().length).toBe(2);
            expect(withBothTurns.getTurns()[0]).toEqual(userTurn);
            expect(withBothTurns.getTurns()[1]).toEqual(botTurn);
        });

        it("[Unhappy] should throw error when adding consecutive turns from same sender", () => {
            const context = new ChatThread();
            const userTurn1: ChatTurn = {
                sender: "user",
                partials: [{ type: "text", content: "Hello" }],
            };

            const userTurn2: ChatTurn = {
                sender: "user",
                partials: [{ type: "text", content: "How are you?" }],
            };

            const withUserTurn = context.addTurn(userTurn1);

            expect(() => withUserTurn.addTurn(userTurn2)).toThrow();
        });
    });

    describe("addTextMessage", () => {
        it("[Happy] should create a new turn for a text message from a new sender", () => {
            const context = new ChatThread();
            const newContext = context.addTextMessage("Hello", "user");

            const turns = newContext.getTurns();
            expect(turns.length).toBe(1);
            expect(turns[0].sender).toBe("user");
            expect(turns[0].partials.length).toBe(1);
            expect(turns[0].partials[0]).toEqual({ type: "text", content: "Hello" });
        });

        it("[Happy] should add text message to existing turn from same sender", () => {
            let context = new ChatThread();
            context = context.addTextMessage("Hello", "user");
            context = context.addTextMessage("How are you?", "user");

            const turns = context.getTurns();
            expect(turns.length).toBe(1);
            expect(turns[0].sender).toBe("user");
            expect(turns[0].partials.length).toBe(2);
            expect(turns[0].partials[0]).toEqual({ type: "text", content: "Hello" });
            expect(turns[0].partials[1]).toEqual({ type: "text", content: "How are you?" });
        });

        it("[Happy] should create a new turn for a text message from different sender", () => {
            let context = new ChatThread();
            context = context.addTextMessage("Hello", "user");
            context = context.addTextMessage("Hi there", "bot");

            const turns = context.getTurns();
            expect(turns.length).toBe(2);
            expect(turns[0].sender).toBe("user");
            expect(turns[1].sender).toBe("bot");
        });
    });

    describe("addImageMessage", () => {
        it("[Happy] should create a new turn for an image message from a new sender", () => {
            const context = new ChatThread();
            const base64Data = "data:image/png;base64,abc123";
            const newContext = context.addImageMessage(base64Data, "user");

            const turns = newContext.getTurns();
            expect(turns.length).toBe(1);
            expect(turns[0].sender).toBe("user");
            expect(turns[0].partials.length).toBe(1);
            expect(turns[0].partials[0]).toEqual({ type: "image", base64Data });
        });

        it("[Happy] should add image message to existing turn from same sender", () => {
            const base64Data1 = "data:image/png;base64,abc123";
            const base64Data2 = "data:image/png;base64,def456";

            let context = new ChatThread();
            context = context.addImageMessage(base64Data1, "user");
            context = context.addImageMessage(base64Data2, "user");

            const turns = context.getTurns();
            expect(turns.length).toBe(1);
            expect(turns[0].sender).toBe("user");
            expect(turns[0].partials.length).toBe(2);
            expect(turns[0].partials[0]).toEqual({ type: "image", base64Data: base64Data1 });
            expect(turns[0].partials[1]).toEqual({ type: "image", base64Data: base64Data2 });
        });
    });

    describe("mixed text and image messages", () => {
        it("[Happy] should handle mixed text and image messages in the same turn", () => {
            const base64Data = "data:image/png;base64,abc123";

            let context = new ChatThread();
            context = context.addTextMessage("Hello", "user");
            context = context.addImageMessage(base64Data, "user");
            context = context.addTextMessage("This is an image", "user");

            const turns = context.getTurns();
            expect(turns.length).toBe(1);
            expect(turns[0].sender).toBe("user");
            expect(turns[0].partials.length).toBe(3);
            expect(turns[0].partials[0]).toEqual({ type: "text", content: "Hello" });
            expect(turns[0].partials[1]).toEqual({ type: "image", base64Data });
            expect(turns[0].partials[2]).toEqual({ type: "text", content: "This is an image" });
        });
    });

    describe("convenience methods", () => {
        it("[Happy] should add user text message", () => {
            const context = new ChatThread();
            const newContext = context.addUserTextMessage("Hello");

            const turns = newContext.getTurns();
            expect(turns.length).toBe(1);
            expect(turns[0].sender).toBe("user");
            expect(turns[0].partials[0]).toEqual({ type: "text", content: "Hello" });
        });

        it("[Happy] should add bot text message", () => {
            const context = new ChatThread();
            const newContext = context.addBotTextMessage("Hello");

            const turns = newContext.getTurns();
            expect(turns.length).toBe(1);
            expect(turns[0].sender).toBe("bot");
            expect(turns[0].partials[0]).toEqual({ type: "text", content: "Hello" });
        });

        it("[Happy] should add user image message", () => {
            const context = new ChatThread();
            const base64Data = "data:image/png;base64,abc123";
            const newContext = context.addUserImageMessage(base64Data);

            const turns = newContext.getTurns();
            expect(turns.length).toBe(1);
            expect(turns[0].sender).toBe("user");
            expect(turns[0].partials[0]).toEqual({ type: "image", base64Data });
        });

        it("[Happy] should add bot image message", () => {
            const context = new ChatThread();
            const base64Data = "data:image/png;base64,abc123";
            const newContext = context.addBotImageMessage(base64Data);

            const turns = newContext.getTurns();
            expect(turns.length).toBe(1);
            expect(turns[0].sender).toBe("bot");
            expect(turns[0].partials[0]).toEqual({ type: "image", base64Data });
        });
    });

    describe("toString", () => {
        it("[Happy] should extract text content from all turns", () => {
            let context = new ChatThread();
            context = context.addUserTextMessage("Hello");
            context = context.addBotTextMessage("Hi there");

            expect(context.toString()).toBe("Hello\nHi there");
        });

        it("[Happy] should skip image content when converting to string", () => {
            let context = new ChatThread();
            context = context.addUserTextMessage("Hello");
            context = context.addUserImageMessage("data:image/png;base64,abc123");
            context = context.addUserTextMessage("Goodbye");

            expect(context.toString()).toBe("Hello\nGoodbye");
        });
    });

    describe("toLogString", () => {
        it("[Happy] should format all types of content for logging", () => {
            let context = new ChatThread();
            const base64Data = "data:image/png;base64,abc123";

            context = context.addUserTextMessage("Hello");
            context = context.addUserImageMessage(base64Data);
            const logString = context.toLogString();

            expect(logString).toContain("[user]");
            expect(logString).toContain("Hello");
            expect(logString).toContain("[IMAGE:");
        });
    });
});
