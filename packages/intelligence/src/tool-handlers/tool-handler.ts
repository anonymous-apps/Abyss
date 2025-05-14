import {
    ReferencedChatThreadRecord,
    ReferencedLogStreamRecord,
    ReferencedMessageRecord,
    SQliteClient,
    ToolCallRequestPartial,
    ToolDefinitionType,
} from '@abyss/records';

export interface ToolHandlerExecution {
    callerId: string;
    chat: ReferencedChatThreadRecord;
    request: ToolCallRequestPartial['payloadData'];
    sqliteClient: SQliteClient;
}

export interface ToolHandlerExecutionInternal {
    callerId: string;
    chat: ReferencedChatThreadRecord;
    request: ToolCallRequestPartial['payloadData'];
    sqliteClient: SQliteClient;
    log: ReferencedLogStreamRecord;
}

export abstract class ToolHandler {
    constructor(private readonly toolDefinition: ToolDefinitionType) {}

    async execute(
        callerId: string,
        chat: ReferencedChatThreadRecord,
        request: ToolCallRequestPartial['payloadData'],
        sqliteClient: SQliteClient
    ) {
        const dimensions = {
            toolDefintion: this.toolDefinition.name,
        };
        return await sqliteClient.tables.metric.wrapSqliteMetric('tool-handler', dimensions, async () => {
            await this.handleExecute({ callerId, chat, request, sqliteClient });
        });
    }

    private async handleExecute(params: ToolHandlerExecution) {
        // Create a new message for this tool call
        const responseMessage = await params.sqliteClient.tables.message.create({
            type: 'tool-call-response',
            senderId: 'system',
            payloadData: {
                toolCallId: params.request.toolCallId,
                shortName: this.toolDefinition.shortName,
                status: 'inProgress',
                result: '',
            },
        });
        const messageRef = new ReferencedMessageRecord(responseMessage.id, params.sqliteClient);
        await params.chat.addMessages(messageRef);

        // Log the tool call
        const logRef = await params.sqliteClient.tables.logStream.new('tool-call', responseMessage.id);

        try {
            // Execute the tool
            const result = await this._execute({ ...params, log: logRef });

            // Update the message with the success
            await messageRef.update({
                payloadData: {
                    toolCallId: params.request.toolCallId,
                    shortName: this.toolDefinition.shortName,
                    result,
                    status: 'success',
                },
            });
            await logRef.success();
        } catch (error) {
            await messageRef.update({
                payloadData: {
                    toolCallId: params.request.toolCallId,
                    shortName: this.toolDefinition.shortName,
                    result: (error as Error).message,
                    status: 'failed',
                },
            });
            throw error;
        } finally {
        }
    }

    protected abstract _execute(params: ToolHandlerExecutionInternal): Promise<string>;
}
