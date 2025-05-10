import { describe, expect, it } from 'vitest';
import { parseLLMOutput } from './parser';

const SAMPLE_RAW = `hey there, this is a string. 

<toolCall>
   <param>I can have tool calls</param>
<param2><subparam>I can have nexted values </subparam></param2>
</toolCall>

Additionally you can have as may sections of tool calls and text as you want!

<anotherOne><![CDATA[ I CAN WRAP IT IN CDATA WOW ]]></anotherOne>

<almost a tool call but its not!`;

const EXPECTED_OUTPUT = [
    {
        type: 'text',
        content: 'hey there, this is a string.',
    },
    {
        type: 'tool',
        content: {
            toolCall: {
                param: 'I can have tool calls',
                param2: {
                    subparam: 'I can have nexted values',
                },
            },
        },
    },
    {
        type: 'text',
        content: 'Additionally you can have as may sections of tool calls and text as you want!',
    },
    {
        type: 'tool',
        content: {
            anotherOne: 'I CAN WRAP IT IN CDATA WOW',
        },
    },
    {
        type: 'text',
        content: '<almost a tool call but its not!',
    },
];

describe('parseLLMOutput', () => {
    it('parses mixed text and tool calls correctly', () => {
        const result = parseLLMOutput(SAMPLE_RAW);
        expect(result).toEqual(EXPECTED_OUTPUT);
    });

    it('falls back to text when encountering an unclosed tag', () => {
        const raw = 'Hello <unclosed> world';
        const result = parseLLMOutput(raw);
        expect(result).toEqual([
            {
                type: 'text',
                content: 'Hello <unclosed> world',
            },
        ]);
    });
});
