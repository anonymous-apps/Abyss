import { MockedLLM } from '../../../src/implementations/language/mocked';
import { ToolsLanguageModel } from '../../../src/framework/language/handler-tools';
import { snapshot } from '../../utils/snapshot.test';
import { ChatContext } from '../../../src';

describe('ToolsLanguageModel', () => {
    it('should create a chat context with tool instructions and parse xml response', async () => {
        const model = new MockedLLM({
            responses: [
                `
                Let me help you with that.

                \`\`\`xml
                <search>
                    <query>find files</query>
                    <directory>src</directory>
                </search>
                \`\`\`

                Now let me analyze the results.

                \`\`\`xml
                <analyze>
                    <files>["file1.ts", "file2.ts"]</files>
                </analyze>
                \`\`\`
            `,
            ],
        });

        const result = await ToolsLanguageModel(model, {
            context: new ChatContext().addUserMessage('Help me find and analyze files'),
            tools: [
                {
                    name: 'search',
                    description: 'Search for files',
                    format: {
                        query: 'string',
                        directory: 'string',
                    },
                },
                {
                    name: 'analyze',
                    description: 'Analyze files',
                    format: {
                        files: 'string[]',
                    },
                },
            ],
        });

        snapshot(result.chat.toLogString());
    });

    it('should handle multiple tool-based interactions and correctly parse XML responses', async () => {
        const model = new MockedLLM({
            responses: [
                `Let me check the system status.
                \`\`\`xml
                <systemCheck>
                    <status>healthy</status>
                    <metrics>
                        <cpu>45.2</cpu>
                        <memory>1024</memory>
                        <uptime>3600</uptime>
                    </metrics>
                </systemCheck>
                \`\`\`
                
                The system appears to be healthy.`,

                `Now I'll fetch the detailed logs.
                \`\`\`xml
                <logFetch>
                    <timeRange>
                        <start>2024-01-01</start>
                        <end>2024-01-02</end>
                    </timeRange>
                    <logEntries>["error1", "error2", "error3"]</logEntries>
                </logFetch>
                \`\`\`
                
                Found 3 log entries in the specified time range.`,
            ],
        });

        const tools = [
            {
                name: 'systemCheck',
                description: 'Check system status and metrics',
                format: {
                    status: 'string',
                    metrics: {
                        cpu: 'number',
                        memory: 'number',
                        uptime: 'number',
                    },
                },
            },
            {
                name: 'logFetch',
                description: 'Fetch system logs',
                format: {
                    timeRange: {
                        start: 'string',
                        end: 'string',
                    },
                    logEntries: 'string[]',
                },
            },
        ];

        const statusResult = await ToolsLanguageModel(model, {
            context: new ChatContext().addUserMessage('Check the system status'),
            tools,
        });

        expect(statusResult.parsed).toEqual([
            {
                systemCheck: {
                    status: 'healthy',
                    metrics: {
                        cpu: '45.2',
                        memory: '1024',
                        uptime: '3600',
                    },
                },
            },
        ]);

        const logsResult = await ToolsLanguageModel(model, {
            context: new ChatContext().addUserMessage('Get the system logs'),
            tools,
        });

        expect(logsResult.parsed).toEqual([
            {
                logFetch: {
                    timeRange: {
                        start: '2024-01-01',
                        end: '2024-01-02',
                    },
                    logEntries: '["error1", "error2", "error3"]',
                },
            },
        ]);

        snapshot([
            {
                question: statusResult.chat.getMessages()[0].text,
                response: statusResult.response,
                parsed: statusResult.parsed,
            },
            {
                question: logsResult.chat.getMessages()[0].text,
                response: logsResult.response,
                parsed: logsResult.parsed,
            },
        ]);
    });
});
