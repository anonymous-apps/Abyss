import { ChatTurnHeader } from '@abyss/ui-components';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router';
import { useRecordReference } from '../../../library/references';

export function SectionHeader({ sender, timestamp }: { sender: string; timestamp?: Date }) {
    const navigate = useNavigate();
    const reference = useRecordReference({ sourceId: sender });
    const formattedTime = timestamp ? formatDistanceToNow(timestamp, { addSuffix: true }) : undefined;

    return (
        <ChatTurnHeader
            icon={reference.icon}
            label={reference.label}
            timestamp={formattedTime}
            onClick={reference.link ? () => navigate(reference.link!) : undefined}
        />
    );
}
