import { spawn } from 'node:child_process';

export function runCommandAtPath(command: string, path: string): Promise<string> {
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
