import { NewToolDefinitionPartial, ReferencedMessageThreadRecord, RemoveToolDefinitionPartial, TextPartial } from '@abyss/records';
import { Log } from '../../../utils/logs';
import { AnthropicMessage, ConversationTurn } from './types';

export async function buildAnthropicMessages(thread: ReferencedMessageThreadRecord): Promise<AnthropicMessage[]> {
    const messages = await thread.getAllMessages();
    const message: ConversationTurn[] = [];

    const consumeMessageTurn = (turn: ConversationTurn) => {
        const lastTurn = message[message.length - 1];

        if (!lastTurn) {
            message.push(turn);
            return;
        }

        const lastTurnRole = lastTurn.role;
        const thisTurnRole = turn.role;

        if (lastTurnRole === thisTurnRole) {
            lastTurn.content.push(...turn.content);
        } else {
            message.push(turn);
        }
    };

    for (const partial of messages) {
        if (partial.type === 'text') {
            consumeMessageTurn(serializeTextPartial(partial));
        } else if (partial.type === 'new-tool-definition') {
            consumeMessageTurn(serializeAddedToolDefinitions(partial));
        } else if (partial.type === 'remove-tool-definition') {
            consumeMessageTurn(serizleRemovedToolDefinitions(partial));
        } else {
            Log.warn('AnthropicSerializer', `Cant serialize partial: ${partial.type} as anthropic doesnt support it currently`);
        }
    }

    return message;
}

function serializeTextPartial(partial: TextPartial): ConversationTurn {
    return {
        role: 'user',
        content: [
            {
                type: 'text',
                text: partial.payloadData.content,
            },
        ],
    };
}

function serializeAddedToolDefinitions(partial: NewToolDefinitionPartial): ConversationTurn {
    return {
        role: 'user',
        content: [
            {
                type: 'text',
                text: `
                You were just given access to the following tools:
                ${partial.payloadData.tools.map(t => t.shortName).join(', ')}
            `,
            },
        ],
    };
}

function serizleRemovedToolDefinitions(partial: RemoveToolDefinitionPartial): ConversationTurn {
    return {
        role: 'user',
        content: [
            {
                type: 'text',
                text: `
                You are no longer allowed to use the following tools:
                ${partial.payloadData.tools.map(t => t).join(', ')}
            `,
            },
        ],
    };
}
