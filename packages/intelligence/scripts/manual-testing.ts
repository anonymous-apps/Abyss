import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import * as Intelegence from '../src';
dotenv.config();

const streamExample = async () => {
    const gemini = new Intelegence.GeminiLanguageModel();
    const openai = new Intelegence.OpenAILanguageModel();
    const anthropic = new Intelegence.AnthropicLanguageModel();

    const thread = new Intelegence.ChatThread().addUserTextMessage('Write a single pharagraph about cats.');

    console.log('Starting stream from Gemini...');
    const stream = await Intelegence.Operations.streamText({
        model: gemini,
        thread,
    });
    writeFileSync('context.input', stream.inputThread.toLogString());

    const output: Intelegence.Message[] = [];
    stream.onTextMessageUpdate(message => {
        output.push(message);
    });

    stream.onComplete(() => {
        writeFileSync('context.output', JSON.stringify(output, null, 2));
    });

    await stream.waitForCompletion();
};

streamExample();
