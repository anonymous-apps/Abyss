import { ToolHandler, type ToolHandlerExecutionInternal } from '../tool-handler';

interface Parameters {
    input: string;
}

export class HelloWorldToolHandler extends ToolHandler {
    protected async _execute(params: ToolHandlerExecutionInternal) {
        const parameters = params.request.parameters as Parameters;
        return parameters.input;
    }
}
