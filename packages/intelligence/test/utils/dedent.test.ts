import { dedent } from '../../src/utils/dedent';

describe('dedent', () => {
    it('should remove leading spaces from each line', () => {
        const input = `
            line 1
            line 2
            line 3
        `;
        const expectedOutput = `
line 1
line 2
line 3
`;
        expect(dedent(input)).toEqual(expectedOutput);
    });

    it('should handle empty strings', () => {
        const input = '';
        const expectedOutput = '';
        expect(dedent(input)).toEqual(expectedOutput);
    });

    it('should handle strings without leading spaces', () => {
        const input = `
        test
        {
    object
}
        `;
        const expectedOutput = `
test
{
    object
}
`;
        expect(dedent(input)).toEqual(expectedOutput);
    });

    it('should handle strings with mixed leading spaces', () => {
        const input = `
            line 1
        line 2
            line 3
        `;
        const expectedOutput = `
line 1
line 2
line 3
`;
        expect(dedent(input)).toEqual(expectedOutput);
    });

    it('should handle strings with block quotes', () => {
        const input = `
        line 1
        line 2
            line 3
        \`\`\`
        {
            object
        }
        \`\`\`
        `;
        const expectedOutput = `
line 1
line 2
    line 3
\`\`\`
{
    object
}
\`\`\`
`;
        expect(dedent(input)).toEqual(expectedOutput);
    });
});
