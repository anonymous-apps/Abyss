import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { z } from 'zod';
import * as Intelegence from '../src';
dotenv.config();

const streamExample = async () => {
    const gemini = new Intelegence.GeminiLanguageModel();
    const openai = new Intelegence.OpenAILanguageModel();
    const anthropic = new Intelegence.AnthropicLanguageModel();

    const thread = new Intelegence.ChatThread().addUserTextMessage('Write a single pharagraph about cats.');

    console.log('Starting stream from Gemini...');
    const stream = await Intelegence.Operations.generateWithTools({
        model: anthropic,
        thread,
        toolDefinitions: [
            {
                name: 'cat',
                description: 'A tool to generate a single pharagraph about cats.',
                parameters: z.object({
                    name: z.string().describe('The name of the cat'),
                }),
            },
        ],
    });
    writeFileSync('context.input', stream.threadOutput.toLogString());
    writeFileSync('context.internal', stream.threadIntermediate.toLogString());
    writeFileSync('context.output', stream.outputRaw);
};

streamExample();
