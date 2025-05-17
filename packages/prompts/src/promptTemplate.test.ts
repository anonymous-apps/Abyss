import { describe, expect, it } from 'vitest';
import { PromptTemplate } from './promptTemplate';

describe('PromptTemplate', () => {
    describe('Text Rendering', () => {
        it('should render a simple text prompt', () => {
            const template = new PromptTemplate();
            template.addText({ type: 'text', content: 'Hello, world!' });
            const compiledPrompt = template.compile({}); // Pass empty object for params
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render multiple text segments', () => {
            const template = new PromptTemplate();
            template.addText({ type: 'text', content: 'This is the first sentence.' });
            template.addText({ type: 'text', content: 'This is the second sentence.' });
            const compiledPrompt = template.compile({}); // Pass empty object for params
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render text from a function', () => {
            const template = new PromptTemplate<{ name: string }>();
            template.addText(params => ({ type: 'text', content: `Hello, ${params.name}!` }));
            const compiledPrompt = template.compile({ name: 'Alice' });
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });
    });

    describe('Header Rendering', () => {
        it('should render a header (h1)', () => {
            const template = new PromptTemplate();
            template.addHeader({ type: 'header', content: 'Main Title' });
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render a header2 (h2)', () => {
            const template = new PromptTemplate();
            template.addHeader2({ type: 'header2', content: 'Subtitle' });
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render a header3 (h3)', () => {
            const template = new PromptTemplate();
            template.addHeader3({ type: 'header3', content: 'Minor Section' });
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render multiple headers', () => {
            const template = new PromptTemplate();
            template.addHeader({ type: 'header', content: 'Document Title' });
            template.addText({ type: 'text', content: 'Some introductory text.' });
            template.addHeader2({ type: 'header2', content: 'Chapter 1' });
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render headers from a function', () => {
            const template = new PromptTemplate<{ title: string }>();
            template.addHeader(params => ({ type: 'header', content: `Title: ${params.title}` }));
            const compiledPrompt = template.compile({ title: 'Dynamic Header' });
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });
    });

    describe('XML Rendering', () => {
        it('should render a simple XML element', () => {
            const template = new PromptTemplate();
            template.addXMLElement({ type: 'xmlElement', content: { user_request: 'Find Italian restaurants' } });
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render XML with various data types', () => {
            const template = new PromptTemplate();
            template.addXMLElement({
                type: 'xmlElement',
                content: {
                    query: 'sushi',
                    count: 10,
                    is_premium: true,
                    location: null,
                    details: 'Include spicy options\nand vegan rolls.',
                },
            });
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render nested XML elements', () => {
            const template = new PromptTemplate();
            template.addXMLElement({
                type: 'xmlElement',
                content: {
                    search_parameters: {
                        keyword: 'coffee shop',
                        radius_km: 5,
                        open_now: true,
                    },
                },
            });
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render XML from a function', () => {
            const template = new PromptTemplate<{ toolName: string; description: string }>();
            template.addXMLElement(params => ({
                type: 'xmlElement',
                content: {
                    tool_description: {
                        name: params.toolName,
                        purpose: params.description,
                    },
                },
            }));
            const compiledPrompt = template.compile({ toolName: 'Calculator', description: 'Performs arithmetic operations' });
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });
    });

    describe('Sub-Prompt Rendering', () => {
        it('should render a prompt with a sub-prompt', () => {
            const subTemplate = new PromptTemplate();
            subTemplate.addText({ type: 'text', content: 'This is a sub-prompt.' });
            subTemplate.addHeader3({ type: 'header3', content: 'Sub-header' });
            const compiledSubPrompt = subTemplate.compile({});

            const mainTemplate = new PromptTemplate();
            mainTemplate.addHeader({ type: 'header', content: 'Main Prompt' });
            mainTemplate.addSubPrompt(compiledSubPrompt);
            mainTemplate.addText({ type: 'text', content: 'Text after sub-prompt.' });

            const compiledMainPrompt = mainTemplate.compile({});
            const rendered = compiledMainPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render multiple sub-prompts', () => {
            const subTemplate1 = new PromptTemplate();
            subTemplate1.addText({ type: 'text', content: 'First sub-prompt content.' });
            const compiledSubPrompt1 = subTemplate1.compile({});

            const subTemplate2 = new PromptTemplate();
            subTemplate2.addXMLElement({ type: 'xmlElement', content: { item: 'Sub-prompt XML' } });
            const compiledSubPrompt2 = subTemplate2.compile({});

            const mainTemplate = new PromptTemplate();
            mainTemplate.addText({ type: 'text', content: 'Content before sub-prompts.' });
            mainTemplate.addSubPrompt(compiledSubPrompt1);
            mainTemplate.addText({ type: 'text', content: 'Content between sub-prompts.' });
            mainTemplate.addSubPrompt(compiledSubPrompt2);
            mainTemplate.addText({ type: 'text', content: 'Content after sub-prompts.' });

            const compiledMainPrompt = mainTemplate.compile({});
            const rendered = compiledMainPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render a sub-prompt with dynamic content (sub-prompt compiled with its own params)', () => {
            const subTemplate = new PromptTemplate<{ user: string }>();
            subTemplate.addText(params => ({ type: 'text', content: `User: ${params.user}` }));
            const compiledSubPrompt = subTemplate.compile({ user: 'TestUser' });

            const mainTemplate = new PromptTemplate();
            mainTemplate.addText({ type: 'text', content: 'Main content starts.' });
            mainTemplate.addSubPrompt(compiledSubPrompt);

            const compiledMainPrompt = mainTemplate.compile({});
            const rendered = compiledMainPrompt.render();
            expect(rendered).toMatchSnapshot();
        });
    });

    describe('Edge Cases and Complex Scenarios', () => {
        it('should render an empty template', () => {
            const template = new PromptTemplate();
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot(); // Expect empty string or minimal structure
        });

        it('should render a template with only headers', () => {
            const template = new PromptTemplate();
            template.addHeader({ type: 'header', content: 'Header Only' });
            template.addHeader2({ type: 'header2', content: 'Sub-header Only' });
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render a template with only XML', () => {
            const template = new PromptTemplate();
            template.addXMLElement({ type: 'xmlElement', content: { data: 'XML Only Content' } });
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should render a template with only sub-prompts', () => {
            const subTemplate1 = new PromptTemplate();
            subTemplate1.addText({ type: 'text', content: 'Sub 1' });
            const compiledSub1 = subTemplate1.compile({});

            const subTemplate2 = new PromptTemplate();
            subTemplate2.addText({ type: 'text', content: 'Sub 2' });
            const compiledSub2 = subTemplate2.compile({});

            const mainTemplate = new PromptTemplate();
            mainTemplate.addSubPrompt(compiledSub1);
            mainTemplate.addSubPrompt(compiledSub2);
            const compiledPrompt = mainTemplate.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should handle special characters in text and headers', () => {
            const template = new PromptTemplate();
            template.addHeader({ type: 'header', content: 'Title with <>&"\' characters' });
            template.addText({ type: 'text', content: 'Text with\nnewlines,\ttabs, and <>&"\' special chars.' });
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should handle special characters in XML content (via CDATA or escaping)', () => {
            const template = new PromptTemplate();
            template.addXMLElement({
                type: 'xmlElement',
                content: {
                    note: 'Content with <>&"\' characters and newlines.\nMust be preserved.',
                    escaped_tag: '<test>value</test>',
                },
            });
            const compiledPrompt = template.compile({});
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();
        });

        it('should handle dynamic cell functions returning undefined', () => {
            const template = new PromptTemplate<{ show: boolean }>();
            template.addText(params => {
                if (params.show) {
                    return { type: 'text', content: 'Shown' };
                }
                return undefined; // Explicitly return undefined
            });
            template.addText({ type: 'text', content: 'Always shown' });

            const compiledPrompt1 = template.compile({ show: true });
            expect(compiledPrompt1.render()).toMatchSnapshot('shown');

            const compiledPrompt2 = template.compile({ show: false });
            expect(compiledPrompt2.render()).toMatchSnapshot('hidden');
        });

        it('should handle dynamic cell functions returning an empty array', () => {
            const template = new PromptTemplate<{ include: boolean }>();
            template.addText(params => {
                if (params.include) {
                    return [
                        { type: 'text', content: 'Included Text 1' },
                        { type: 'text', content: 'Included Text 2' },
                    ];
                }
                return []; // Return empty array
            });
            template.addText({ type: 'text', content: 'Footer text' });

            const compiledPrompt1 = template.compile({ include: true });
            expect(compiledPrompt1.render()).toMatchSnapshot('included');

            const compiledPrompt2 = template.compile({ include: false });
            expect(compiledPrompt2.render()).toMatchSnapshot('not_included');
        });

        it('should render a complex nested prompt with mixed types and dynamic content', () => {
            const innerSubTemplate = new PromptTemplate<{ item: string }>();
            innerSubTemplate.addText(params => ({ type: 'text', content: `Item: ${params.item}` }));
            const compiledInnerSub = innerSubTemplate.compile({ item: 'Nested Dynamic Item' });

            const subTemplate = new PromptTemplate<{ section_title: string }>();
            subTemplate.addHeader3(params => ({ type: 'header3', content: params.section_title }));
            subTemplate.addXMLElement({ type: 'xmlElement', content: { data: 'Sub-prompt data', value: 123 } });
            subTemplate.addSubPrompt(compiledInnerSub);
            const compiledSub = subTemplate.compile({ section_title: 'Dynamic Sub Section' });

            const mainTemplate = new PromptTemplate<{ main_title: string; show_extra: boolean }>();
            mainTemplate.addHeader(params => ({ type: 'header', content: params.main_title }));
            mainTemplate.addText({ type: 'text', content: 'Introduction to the main prompt.' });
            mainTemplate.addSubPrompt(compiledSub);
            mainTemplate.addText(params => {
                if (params.show_extra) {
                    return { type: 'text', content: 'Extra content is shown!' };
                }
                return undefined;
            });
            mainTemplate.addXMLElement({
                type: 'xmlElement',
                content: { final_notes: { note1: 'abc', note2: true, note3: null } },
            });

            const compiledPrompt = mainTemplate.compile({ main_title: 'Complex Test Main Title', show_extra: true });
            const rendered = compiledPrompt.render();
            expect(rendered).toMatchSnapshot();

            const compiledPromptNoExtra = mainTemplate.compile({ main_title: 'Complex Test Main Title', show_extra: false });
            const renderedNoExtra = compiledPromptNoExtra.render();
            expect(renderedNoExtra).toMatchSnapshot('complex_no_extra');
        });
    });
});
