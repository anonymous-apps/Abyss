import { describe, expect, it } from 'vitest';
import { CompiledPrompt } from './compiledPrompt';
import { PromptTemplate } from './promptTemplate';

describe('PromptTemplate', () => {
    describe('Static Content', () => {
        it('should create a template with static text', () => {
            const template = new PromptTemplate();
            template.addText('Hello World');

            const result = template.compile({});
            const cells = result.getCells();
            expect(cells).toHaveLength(1);
            expect(cells[0]).toEqual({
                type: 'text',
                content: 'Hello World',
            });
        });

        it('should create a template with multiple static cells', () => {
            const template = new PromptTemplate();
            template.addHeader('Title').addText('Some text').addHeader2('Subtitle').addHeader3('Small Title');

            const result = template.compile({});
            const cells = result.getCells();
            expect(cells).toHaveLength(4);
            expect(cells).toEqual([
                { type: 'header', content: 'Title' },
                { type: 'text', content: 'Some text' },
                { type: 'header2', content: 'Subtitle' },
                { type: 'header3', content: 'Small Title' },
            ]);
        });

        it('should handle array of text', () => {
            const template = new PromptTemplate();
            template.addText(['First', 'Second']);

            const result = template.compile({});
            const cells = result.getCells();
            expect(cells).toHaveLength(2);
            expect(cells).toEqual([
                { type: 'text', content: 'First' },
                { type: 'text', content: 'Second' },
            ]);
        });

        it('should handle empty array', () => {
            const template = new PromptTemplate();
            template.addText([]);

            const result = template.compile({});
            const cells = result.getCells();
            expect(cells).toHaveLength(0);
        });

        it('should handle undefined cells', () => {
            const template = new PromptTemplate();
            template.addText(undefined);
            template.addText('Valid text');

            const result = template.compile({});
            const cells = result.getCells();
            expect(cells).toHaveLength(1);
            expect(cells[0]).toEqual({
                type: 'text',
                content: 'Valid text',
            });
        });

        it('should handle null cells', () => {
            const template = new PromptTemplate();
            template.addText(null as any);
            template.addText('Valid text');

            const result = template.compile({});
            const cells = result.getCells();
            expect(cells).toHaveLength(1);
            expect(cells[0]).toEqual({
                type: 'text',
                content: 'Valid text',
            });
        });

        it('should handle empty string', () => {
            const template = new PromptTemplate();
            template.addText('');

            const result = template.compile({});
            const cells = result.getCells();
            expect(cells).toHaveLength(0);
        });
    });

    describe('Dynamic Content', () => {
        it('should handle dynamic content with parameters', () => {
            interface Params {
                name: string;
                age: number;
            }

            const template = new PromptTemplate<Params>();
            template.addText(params => `Hello ${params.name}`).addHeader2(params => `Age: ${params.age}`);

            const result = template.compile({ name: 'John', age: 30 });
            const cells = result.getCells();
            expect(cells).toHaveLength(2);
            expect(cells).toEqual([
                { type: 'text', content: 'Hello John' },
                { type: 'header2', content: 'Age: 30' },
            ]);
        });

        it('should handle dynamic array of text', () => {
            interface Params {
                items: string[];
            }

            const template = new PromptTemplate<Params>();
            template.addText(params => params.items);

            const result = template.compile({ items: ['One', 'Two', 'Three'] });
            const cells = result.getCells();
            expect(cells).toHaveLength(3);
            expect(cells).toEqual([
                { type: 'text', content: 'One' },
                { type: 'text', content: 'Two' },
                { type: 'text', content: 'Three' },
            ]);
        });

        it('should handle dynamic undefined cells', () => {
            interface Params {
                show: boolean;
            }

            const template = new PromptTemplate<Params>();
            template.addText(params => (params.show ? 'Visible' : undefined)).addText('Always visible');

            const result = template.compile({ show: false });
            const cells = result.getCells();
            expect(cells).toHaveLength(1);
            expect(cells[0]).toEqual({
                type: 'text',
                content: 'Always visible',
            });
        });

        it('should handle dynamic cell objects', () => {
            interface Params {
                title: string;
            }

            const template = new PromptTemplate<Params>();
            template.addText(params => `Title: ${params.title}`);

            const result = template.compile({ title: 'Test' });
            const cells = result.getCells();
            expect(cells).toHaveLength(1);
            expect(cells[0]).toEqual({
                type: 'text',
                content: 'Title: Test',
            });
        });

        it('should handle dynamic array of cell objects', () => {
            interface Params {
                items: string[];
            }

            const template = new PromptTemplate<Params>();
            template.addText(params => params.items.map(item => `Item: ${item}`));

            const result = template.compile({ items: ['One', 'Two'] });
            const cells = result.getCells();
            expect(cells).toHaveLength(2);
            expect(cells).toEqual([
                { type: 'text', content: 'Item: One' },
                { type: 'text', content: 'Item: Two' },
            ]);
        });

        it('should handle mixed dynamic content', () => {
            interface Params {
                name: string;
                items: string[];
            }

            const template = new PromptTemplate<Params>();
            template
                .addHeader(params => `Hello ${params.name}`)
                .addText(params => params.items)
                .addHeader2('Static Header')
                .addText(params => `Last item: ${params.items[params.items.length - 1]}`);

            const result = template.compile({ name: 'John', items: ['One', 'Two'] });
            const cells = result.getCells();
            expect(cells).toHaveLength(5);
            expect(cells).toEqual([
                { type: 'header', content: 'Hello John' },
                { type: 'text', content: 'One' },
                { type: 'text', content: 'Two' },
                { type: 'header2', content: 'Static Header' },
                { type: 'text', content: 'Last item: Two' },
            ]);
        });

        it('should handle empty dynamic arrays', () => {
            interface Params {
                items: string[];
            }

            const template = new PromptTemplate<Params>();
            template.addText(params => params.items);

            const result = template.compile({ items: [] });
            const cells = result.getCells();
            expect(cells).toHaveLength(0);
        });

        it('should handle dynamic content with missing parameters', () => {
            interface Params {
                name?: string;
            }

            const template = new PromptTemplate<Params>();
            template.addText(params => `Hello ${params.name ?? 'Anonymous'}`);

            const result = template.compile({});
            const cells = result.getCells();
            expect(cells).toHaveLength(1);
            expect(cells[0]).toEqual({
                type: 'text',
                content: 'Hello Anonymous',
            });
        });

        it('should handle dynamic content with null parameters', () => {
            interface Params {
                name: string | null;
            }

            const template = new PromptTemplate<Params>();
            template.addText(params => `Hello ${params.name ?? 'Anonymous'}`);

            const result = template.compile({ name: null });
            const cells = result.getCells();
            expect(cells).toHaveLength(1);
            expect(cells[0]).toEqual({
                type: 'text',
                content: 'Hello Anonymous',
            });
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid cell type', () => {
            const template = new PromptTemplate();
            template.addText('Test');

            const result = template.compile({});
            const cells = result.getCells();
            expect(cells).toHaveLength(1);
            expect(cells[0]).toEqual({
                type: 'text',
                content: 'Test',
            });
        });

        it('should handle invalid dynamic content', () => {
            interface Params {
                value: any;
            }

            const template = new PromptTemplate<Params>();
            template.addText(params => params.value);

            const result = template.compile({ value: { invalid: 'object' } });
            const cells = result.getCells();
            expect(cells).toHaveLength(1);
            expect(cells[0]).toEqual({
                type: 'text',
                content: { invalid: 'object' },
            });
        });

        it('should handle invalid dynamic array content', () => {
            interface Params {
                items: any[];
            }

            const template = new PromptTemplate<Params>();
            template.addText(params => params.items);

            const result = template.compile({ items: [{ invalid: 'object' }, 'valid'] });
            const cells = result.getCells();
            expect(cells).toHaveLength(2);
            expect(cells).toEqual([
                { type: 'text', content: { invalid: 'object' } },
                { type: 'text', content: 'valid' },
            ]);
        });
    });

    describe('CompiledPrompt', () => {
        it('should return a new array when getting cells', () => {
            const cells = [
                { type: 'text' as const, content: 'Test' },
                { type: 'header' as const, content: 'Header' },
            ];
            const prompt = new CompiledPrompt(cells);
            const result = prompt.getCells();

            expect(result).toEqual(cells);
            expect(result).not.toBe(cells); // Should be a new array
        });

        it('should handle empty cells array', () => {
            const prompt = new CompiledPrompt([]);
            const result = prompt.getCells();

            expect(result).toEqual([]);
            expect(result).not.toBe([]); // Should be a new array
        });
    });

    describe('CompiledPrompt.render', () => {
        it('should render text cells', () => {
            const prompt = new CompiledPrompt([
                { type: 'text', content: 'Hello' },
                { type: 'text', content: 'World' },
            ]);
            expect(prompt.render()).toBe('Hello\nWorld');
        });

        it('should render header cells', () => {
            const prompt = new CompiledPrompt([
                { type: 'header', content: 'Main Title' },
                { type: 'header2', content: 'Subtitle' },
                { type: 'header3', content: 'Small Title' },
            ]);
            expect(prompt.render()).toBe('# Main Title\n## Subtitle\n### Small Title');
        });

        it('should render mixed content', () => {
            const prompt = new CompiledPrompt([
                { type: 'header', content: 'Main Title' },
                { type: 'text', content: 'Intro' },
                { type: 'header2', content: 'Section' },
                { type: 'text', content: 'Details' },
            ]);
            expect(prompt.render()).toBe('# Main Title\nIntro\n## Section\nDetails');
        });

        it('should render XML element cells', () => {
            const prompt = new CompiledPrompt([{ type: 'xmlElement', content: { root: { child: 'value' } } }]);
            expect(prompt.render()).toContain('<root>');
            expect(prompt.render()).toContain('<child>value</child>');
            expect(prompt.render()).toContain('</root>');
        });

        it('should render empty prompt as empty string', () => {
            const prompt = new CompiledPrompt([]);
            expect(prompt.render()).toBe('');
        });
    });
});
