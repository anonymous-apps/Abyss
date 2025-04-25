import { ChatTurnHeader } from '@abyss/ui-components';
import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { useNavigate } from 'react-router';
import { MessageRecord } from '../../../../server/preload/controllers/message';
import { useRecordReference } from '../../../library/references';

export function SectionHeader({ message }: { message: MessageRecord }) {
    const navigate = useNavigate();
    const reference = useRecordReference({ sourceId: message.sourceId });
    const formattedTime = formatDistanceToNow(new Date(message.createdAt), { addSuffix: true });

    if (message.sourceId === 'SYSTEM') {
        return null;
    }

    return (
        <ChatTurnHeader
            icon={reference.icon}
            label={reference.label}
            timestamp={formattedTime}
            onClick={reference.link ? () => navigate(reference.link!) : undefined}
        />
    );
}
