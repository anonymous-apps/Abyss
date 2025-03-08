import { MockedLLM } from '../../../src/implementations/language/mocked';
import { FormattedLanguageModel } from '../../../src/framework/language/handler-formatted';
import { snapshot } from '../../utils/snapshot.test';

describe('FormattedLanguageModel', () => {
    it('should create a chat context with format instructions and parse response', async () => {
        const model = new MockedLLM({
            responses: ['{ "name": "John Doe", "age": 30 }'],
        });

        const result = await FormattedLanguageModel<{ name: string; age: number }>(model, {
            question: 'Who are you?',
            formatExample: {
                name: 'string',
                age: 0,
            },
        });

        snapshot(result.chat.toLogString());
    });

    it('should handle multiple formatted questions and correctly parse JSON responses', async () => {
        const model = new MockedLLM({
            responses: [
                `{
                    "color": "red",
                    "hex": "#FF0000",
                    "rgb": [255, 0, 0]
                }`,
                `{
                    "color": "blue",
                    "hex": "#0000FF",
                    "rgb": [0, 0, 255]
                }`,
            ],
        });

        type ColorInfo = {
            color: string;
            hex: string;
            rgb: number[];
        };

        const formatExample = {
            color: 'string',
            hex: 'string',
            rgb: [0],
        };

        const results = [];

        const redResult = await FormattedLanguageModel<ColorInfo>(model, {
            question: 'What is the color information for red?',
            formatExample,
        });

        expect(redResult.parsed).toEqual({
            color: 'red',
            hex: '#FF0000',
            rgb: [255, 0, 0],
        });

        const blueResult = await FormattedLanguageModel<ColorInfo>(model, {
            question: 'What is the color information for blue?',
            formatExample,
        });

        expect(blueResult.parsed).toEqual({
            color: 'blue',
            hex: '#0000FF',
            rgb: [0, 0, 255],
        });

        results.push(redResult, blueResult);
        snapshot(
            results.map(r => ({
                question: r.chat.getMessages()[0].text,
                parsed: r.parsed,
            }))
        );
    });
});
