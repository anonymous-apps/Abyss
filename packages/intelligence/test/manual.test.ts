import { BedrockLLM, Intelegence, LocalDataStorage, OpenAIChatBasedLLM, OpenAIImageModel } from '../src';
import dotenv from 'dotenv';
dotenv.config();

it('manual-language', async () => {
    const AI = new Intelegence({
        language: new OpenAIChatBasedLLM({
            storage: new LocalDataStorage({
                storagePath: './storage',
            }),
        }),
    });

    const result = await AI.ask({
        question: 'What is the capital of France?',
    });
});

it('manual-image', async () => {
    jest.setTimeout(100_000);
    const AI = new Intelegence({
        image: new OpenAIImageModel({
            storage: new LocalDataStorage({
                storagePath: './storage',
            }),
        }),
    });

    const result = await AI.imagine({
        prompt: 'A beautiful sunset over a calm ocean',
    });
});
