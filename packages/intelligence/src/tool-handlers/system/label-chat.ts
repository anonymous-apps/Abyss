import { ToolHandler, type ToolHandlerExecutionInternal } from '../tool-handler';

interface Parameters {
    label: string;
}

export class LabelChatToolHandler extends ToolHandler {
    protected async _execute(params: ToolHandlerExecutionInternal): Promise<string> {
        const parameters = params.request.parameters as Parameters;
        await params.chat.update({ name: parameters.label });
        return 'Set chat label to ' + parameters.label;
    }
}
