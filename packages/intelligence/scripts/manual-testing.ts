import dotenv from "dotenv";
import { z } from "zod";
import * as Intelegence from "../src";
dotenv.config();

const primeSum = async () => {
    const gemini = new Intelegence.GeminiLanguageModel();
    const thread = new Intelegence.ChatThread().addUserTextMessage("Compute the sum of the first 12 prime numbers");
    const cache = new Intelegence.S3StorageController({
        bucket: "405505053377-us-west-2-llmdatacachebucket",
    });

    const response = await Intelegence.askWithTools({
        model: gemini,
        thread,
        cache,
        toolDefinitions: [
            {
                name: "calculator",
                description: "Perform mathematical calculations",
                parameters: z.object({
                    expression: z.string().describe("The mathematical expression to evaluate in polish notation"),
                }),
            },
        ],
    });
};

const imageGeneration = async () => {
    const gemini = new Intelegence.GeminiLanguageModel();
    const thread = new Intelegence.ChatThread().addUserTextMessage("Generate an image of a cat");
    const cache = new Intelegence.S3StorageController({
        bucket: "405505053377-us-west-2-llmdatacachebucket",
    });
    const response = await gemini.respond(thread, cache);
    console.log(response);
};

imageGeneration();
