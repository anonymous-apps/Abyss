import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { MessageController, MessageRecord, MessageToolCall } from '../../controllers/message';
import { TextLogController } from '../../controllers/text-log';
import { ToolController } from '../../controllers/tool';
import { ToolInvocationController } from '../../controllers/tool-invocation';
import { InvokeBuildNodejsToolInput } from './types';
import { runCommandAtPath } from './utils';
const userDataPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.abyss');
if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
}

export async function handlerInvokeBuildNodejsTool(input: InvokeBuildNodejsToolInput) {
    const { message, tool } = input;
    const toolCall = message as MessageRecord<MessageToolCall>;
    const parameters = toolCall.content.tool.parameters;

    const workspacePath = path.join(userDataPath, 'tool-workspaces', randomUUID());
    fs.mkdirSync(workspacePath, { recursive: true });

    // Capture outputs
    const log = await TextLogController.empty();
    let outputs: string[] = [];

    // Capture tool invoke
    const toolInvocation = await ToolInvocationController.create({
        toolId: tool.id,
        parameters,
        status: 'running',
        textLogId: log.id,
    });

    await MessageController.update(toolCall.id, {
        content: {
            ...toolCall.content,
            tool: {
                ...toolCall.content.tool,
                invocationId: toolInvocation.id,
            },
        },
    });

    try {
        outputs.push(await runCommandAtPath('npm init -y', workspacePath));
        outputs.push(await runCommandAtPath('npm install --save-dev typescript esbuild @types/node', workspacePath));
        outputs.push(await runCommandAtPath('npx tsc --init', workspacePath));
        outputs.push(await runCommandAtPath('mkdir src', workspacePath));
        outputs.push(await runCommandAtPath('mkdir dist', workspacePath));
        outputs.push(
            await runCommandAtPath(
                'npm pkg set scripts.build="npx esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js"',
                workspacePath
            )
        );
        outputs.push(await runCommandAtPath('npm pkg set scripts.start="node dist/index.js"', workspacePath));
        outputs.push(await runCommandAtPath(`npm i ${parameters.dependencies}`, workspacePath));

        const indexFile = `
            import handler from './handler';
            const input = JSON.parse(process.env.INPUT || '{}');
            console.log(handler(input));
        `;

        fs.writeFileSync(path.join(workspacePath, 'src', 'index.ts'), indexFile);
        fs.writeFileSync(path.join(workspacePath, 'src', 'handler.ts'), parameters.code);

        // Create the tool itself
        const schema: Record<string, string> = {};
        for (const [key, description] of Object.entries(parameters.inputs)) {
            schema[key] = description as string;
        }
        const tool = await ToolController.create({
            shortId: parameters.name.toLowerCase().replace(/ /g, '-') + '-' + crypto.randomUUID().substring(0, 4),
            name: parameters.name,
            description: parameters.description,
            type: 'NodeJS',
            schema,
            data: {
                workspacePath: workspacePath,
            },
        });
        outputs.push(`\n# Tool created: ${tool.name} ${tool.id}`);

        // Save status
        await ToolInvocationController.complete(toolInvocation.id);
    } catch (error) {
        await TextLogController.appendToLog(log.id, `\n\n Error: ${error}`);
        await ToolInvocationController.error(toolInvocation.id);
    } finally {
        await TextLogController.appendToLog(log.id, outputs.join('\n'));
    }
}
