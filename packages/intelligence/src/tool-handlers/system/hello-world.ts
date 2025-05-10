import { ReferencedLogStreamRecord, ToolCallRequestPartial } from '@abyss/records';
import { ToolHandler } from '../tool-handler';

interface Parameters {
    input: string;
}

export class HelloWorldToolHandler extends ToolHandler {
    protected async _execute(request: ToolCallRequestPartial['payloadData'], log: ReferencedLogStreamRecord): Promise<string> {
        const parameters = request.parameters as Parameters;
        await log.addMessage({
            level: 'info',
            scope: 'hello-world',
            message: 'Hello, world!',
        });
        return Promise.resolve(parameters.input);
    }
}
