import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { MessageController, MessageRecord, MessageToolCall } from '../../controllers/message';
import { TextLogController } from '../../controllers/text-log';
import { ToolController } from '../../controllers/tool';
import { ToolInvocationController } from '../../controllers/tool-invocation';
import { InvokeSystemToolInput } from './types';

const userDataPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.abyss');
if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
}

function runCommandAtPath(command: string, path: string): Promise<string> {
    const child = spawn(command, { cwd: path, shell: true });
    let out = `> ${command}\n`;

    child.stdout.on('data', data => {
        out += data.toString();
    });

    child.stderr.on('data', data => {
        out += data.toString();
    });

    return new Promise((resolve, reject) => {
        child.on('close', code => {
            if (code === 0) {
                resolve(out);
            } else {
                reject(new Error(`Command exited with code ${code}: ${out}`));
            }
        });
        child.on('error', reject);
    });
}

export async function handlerInvokeSystemTool(input: InvokeSystemToolInput) {
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
        outputs.push(await runCommandAtPath('npm install --save-dev typescript ts-node @types/node', workspacePath));
        outputs.push(await runCommandAtPath('npx tsc --init', workspacePath));
        outputs.push(await runCommandAtPath('mkdir src', workspacePath));
        outputs.push(await runCommandAtPath('npm pkg set scripts.start="ts-node src/index.ts"', workspacePath));
        outputs.push(await runCommandAtPath(`npm i ${parameters.dependencies}`, workspacePath));

        const indexFile = `
            import handler from './handler';
            const input = JSON.parse(process.env.INPUT);
            console.log(handler(input));
        `;

        fs.writeFileSync(path.join(workspacePath, 'src', 'index.ts'), indexFile);
        fs.writeFileSync(path.join(workspacePath, 'src', 'handler.ts'), parameters.code);

        // Create the tool itself
        const schema = {};
        for (const input of parameters.inputs) {
            schema[input.key] = input.description;
        }
        const tool = await ToolController.create({
            name: parameters.name,
            description: parameters.description,
            type: 'NodeJS',
            schema,
        });
        outputs.push(`\n# Tool created: ${tool.name} ${tool.id}`);

        // Save status
        await ToolInvocationController.complete(toolInvocation.id, {
            workspacePath: workspacePath.replace(userDataPath, ''),
        });
    } catch (error) {
        await TextLogController.appendToLog(log.id, `\n\n Error: ${error}`);
        await ToolInvocationController.error(toolInvocation.id, error.message);
    } finally {
        await TextLogController.appendToLog(log.id, outputs.join('\n'));
    }
}
