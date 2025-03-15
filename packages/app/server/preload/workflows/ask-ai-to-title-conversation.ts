import { ChatController } from '../controllers/chat';
import { MessageController } from '../controllers/message';
import { MessageThreadController } from '../controllers/message-thread';
import { ModelConnectionsController } from '../controllers/model-connections';
import { NetworkCallController } from '../controllers/network-call';
import { RenderedConversationThreadController } from '../controllers/rendered-conversation-thread';
import { buildChatContext, buildIntelegence } from './utils';

export async function AskAiToTitleConversation(chatId: string) {
    const chat = await ChatController.getByRecordId(chatId);
    if (!chat) {
        throw new Error('Chat unknown');
    }

    const thread = await MessageThreadController.getByRecordId(chat?.threadId);
    if (!thread) {
        throw new Error('Thread unknown');
    }

    const messages = await MessageController.findByThreadId(thread.id);
    if (!messages || messages.length === 0) {
        throw new Error('No messages in thread');
    }

    const connection = await ModelConnectionsController.getByRecordId(chat.sourceId);
    if (!connection) {
        throw new Error('Connection unknown');
    }

    // Get the AI
    const ai = await buildIntelegence(connection);
    const context = buildChatContext(messages);

    // Ask the AI to generate a title based on the conversation context
    const response = await ai.askWithTools({
        tools: [
            {
                name: 'label',
                description: 'Generate a concise, relevant title for this conversation based on its content',
                format: {
                    title: 'title, 5 words or less',
                    description: 'A concise, relevant description for this conversation based on its content, one sentence.',
                },
            },
        ],
        context: context.addUserMessage(
            'Consider everything before this message only, use the label tool to generate a title for this conversation that will later be used to label the conversation for the user. The conversation is not about the label tool or about generating a title. Consider what the user asked previously and what that conversation could be titled and about.'
        ),
    });

    console.log({ response: response.parsed });

    // Extract the title from the response
    const responseTool = response.parsed[0] as { label: { title: string; description: string } };

    // Update the chat with the generated title
    await ChatController.update(chat.id, {
        name: responseTool.label.title,
        description: responseTool.label.description,
    });

    // Save the thread and call
    if (response.chat) {
        await RenderedConversationThreadController.create({
            messages: response.chat.getMessages() as any,
        });
    }

    if (response.apiCall) {
        await NetworkCallController.create({
            endpoint: response.apiCall.endpoint,
            method: response.apiCall.method,
            status: response.apiCall.status,
            body: JSON.stringify(response.apiCall.body, null, 2),
            response: JSON.stringify(response.apiCall?.response, null, 2),
        });
    }
}
