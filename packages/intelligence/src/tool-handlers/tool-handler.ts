import {
    ReferencedChatThreadRecord,
    ReferencedLogStreamRecord,
    ReferencedMessageRecord,
    SQliteClient,
    ToolCallRequestPartial,
    ToolDefinitionType,
} from '@abyss/records';

export abstract class ToolHandler {
    constructor(private readonly toolDefinition: ToolDefinitionType) {}

    async execute(chat: ReferencedChatThreadRecord, request: ToolCallRequestPartial['payloadData'], sqliteClient: SQliteClient) {
        const dimensions = {
            toolDefintion: this.toolDefinition.name,
        };
        return await sqliteClient.tables.metric.wrapSqliteMetric('tool-handler', dimensions, async () => {
            await this.handleExecute(chat, request, sqliteClient);
        });
    }

    private async handleExecute(
        chat: ReferencedChatThreadRecord,
        request: ToolCallRequestPartial['payloadData'],
        sqliteClient: SQliteClient
    ) {
        // Create a new message for this tool call
        const responseMessage = await sqliteClient.tables.message.create({
            type: 'tool-call-response',
            senderId: 'system',
            payloadData: {
                toolCallId: request.toolCallId,
                status: 'inProgress',
                result: '',
            },
        });
        const messageRef = new ReferencedMessageRecord(responseMessage.id, sqliteClient);
        await chat.addMessages(responseMessage);

        // Log the tool call
        const logRef = await sqliteClient.tables.logStream.new('tool-call', responseMessage.id);

        try {
            // Execute the tool
            const result = await this._execute(request, logRef);

            // Update the message with the success
            await messageRef.update({
                payloadData: {
                    toolCallId: request.toolCallId,
                    result,
                    status: 'success',
                },
            });
            await logRef.success();
        } catch (error) {
            await messageRef.update({
                payloadData: {
                    toolCallId: request.toolCallId,
                    result: (error as Error).message,
                    status: 'failed',
                },
            });
            throw error;
        } finally {
        }
    }

    protected abstract _execute(request: ToolCallRequestPartial['payloadData'], log: ReferencedLogStreamRecord): Promise<string>;
}
