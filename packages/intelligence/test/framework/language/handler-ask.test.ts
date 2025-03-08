import { MockedLLM } from '../../../src/implementations/language/mocked';
import { AskLangaugeModel } from '../../../src/framework/language/handler-ask';
import { snapshot } from '../../utils/snapshot.test';

describe('AskLanguageModel', () => {
    it('should create a chat context and invoke the model', async () => {
        const model = new MockedLLM({
            responses: ['Hello, I am the mocked response'],
        });

        const result = await AskLangaugeModel(model, {
            question: 'What is the meaning of life?',
        });

        snapshot(result.response);
    });

    it('should handle multiple questions with different responses', async () => {
        const model = new MockedLLM({
            responses: ['First response', 'Second response', 'Third response'],
        });

        const results = [];

        results.push(
            await AskLangaugeModel(model, {
                question: 'First question',
            })
        );

        results.push(
            await AskLangaugeModel(model, {
                question: 'Second question',
            })
        );

        results.push(
            await AskLangaugeModel(model, {
                question: 'Third question',
            })
        );

        snapshot(results);
    });
});
