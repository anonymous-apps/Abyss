import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Executes a bash command and returns the result
 * @param cmd The command to execute
 * @returns An object containing the result and optional error
 */
export async function bash(cmd: string, options: { cwd?: string }): Promise<{ result: string; error?: string }> {
    try {
        const { stdout, stderr } = await execAsync(cmd, {
            cwd: options.cwd,
        });
        return {
            result: stdout.trim(),
            ...(stderr ? { error: stderr.trim() } : {}),
        };
    } catch (error: any) {
        return {
            result: error.stdout?.trim() || '',
            error: error.stderr?.trim() || error.message,
        };
    }
}
