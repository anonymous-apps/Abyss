import dotenv from 'dotenv';
import { writeFileSync } from 'fs';
import { z } from 'zod';
import * as Intelegence from '../src';
dotenv.config();

const primeSum = async () => {
    const gemini = new Intelegence.GeminiLanguageModel();
    const thread = new Intelegence.ChatThread().addUserTextMessage('Compute the sum of the first 12 prime numbers');
    const cache = new Intelegence.S3StorageController({
        bucket: '405505053377-us-west-2-llmdatacachebucket',
    });

    const response = await Intelegence.streamWithTools({
        model: gemini,
        thread,
        cache,
        toolDefinitions: [
            {
                name: 'calculator',
                description: 'Perform mathematical calculations',
                parameters: z.object({
                    expression: z.string().describe('The mathematical expression to evaluate in polish notation'),
                }),
            },
        ],
    });
};

const imageGeneration = async () => {
    const gemini = new Intelegence.GeminiLanguageModel();
    const thread = new Intelegence.ChatThread().addUserTextMessage('Generate an image of a cat');
    const cache = new Intelegence.S3StorageController({
        bucket: '405505053377-us-west-2-llmdatacachebucket',
    });
    const response = await gemini.invoke(thread, cache);
    console.log(response);
};

const streamExample = async () => {
    const gemini = new Intelegence.GeminiLanguageModel();
    const thread = new Intelegence.ChatThread().addUserTextMessage('add 10 and 20 and also add 30 and 40. use the tools to do this');

    console.log('Starting stream from Gemini...');
    const stream = await Intelegence.streamWithTools({
        model: gemini,
        thread,
        toolDefinitions: [
            {
                name: 'calculator',
                description: 'Perform mathematical calculations',
                parameters: z.object({
                    expression: z.string().describe('The mathematical expression to evaluate in polish notation'),
                }),
            },
        ],
    });

    writeFileSync('context.input', stream.inputThread.toLogString());

    stream.onNewMessage(message => {
        console.log(message);
    });

    stream.onComplete(() => {
        writeFileSync('context.output', stream.getRawOutput());
    });
};

streamExample();
