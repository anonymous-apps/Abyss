import { describe, expect, it } from 'vitest';
import { dedent } from './dedent';

describe('dedent', () => {
    it('should dedent a string', () => {
        const result = dedent(`
            this is a test
                with some indented text 
            and some more indented text
        `);
        expect(result).toBe('this is a test\n    with some indented text\nand some more indented text');
    });
});
