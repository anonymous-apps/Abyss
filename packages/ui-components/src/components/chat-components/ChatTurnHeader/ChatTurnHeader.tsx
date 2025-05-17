import type { LucideIcon } from 'lucide-react';
import type React from 'react';

export interface ChatTurnHeaderProps {
    /**
     * Icon to display for the chat turn
     */
    icon: LucideIcon;
    /**
     * Label text for the chat turn
     */
    label: string;
    /**
     * Timestamp for the chat turn
     */
    timestamp?: string;
    /**
     * Click handler for the icon and label
     */
    onClick?: () => void;
    /**
     * Additional CSS class names
     */
    className?: string;
}

export const ChatTurnHeader: React.FC<ChatTurnHeaderProps> = ({ icon: Icon, label, timestamp, onClick, className = '' }) => {
    return (
        <div className={`flex items-center gap-2 ${className} text-xs`}>
            <div
                className={`flex items-center justify-center p-1 rounded-sm gap-2 bg-primary-100 px-2 ${
                    onClick ? 'cursor-pointer hover:bg-primary-200' : ''
                }`}
                onClick={onClick}
            >
                <Icon className="h-4 w-4 text-primary-500" />
                <span className="font-medium text-text-400">{label}</span>
            </div>
            {timestamp && <span className=" text-text-600">{timestamp}</span>}
        </div>
    );
};

export default ChatTurnHeader;
