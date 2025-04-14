import { LucideIcon } from 'lucide-react';
import React from 'react';
import Button from '../../inputs/Button/Button';

export interface ActionItem {
    /**
     * Icon for the action item
     */
    icon: LucideIcon;
    /**
     * Tooltip text for the action item
     */
    tooltip: string;
    /**
     * Click handler for the action item
     */
    onClick: () => void;
}

export interface ChatMessageTextProps {
    /**
     * Message text content
     */
    text: string;
    /**
     * Action items to display alongside the message
     */
    actionItems?: ActionItem[];
    /**
     * Additional CSS class names
     */
    className?: string;
}

export const ChatMessageText: React.FC<ChatMessageTextProps> = ({ text, actionItems = [], className = '' }) => {
    return (
        <div className={`relative flex gap-2 w-full hover:bg-background-200 py-2 px-2 rounded-sm text-xs ${className}`}>
            <div className={`flex-grow pr-12`}>
                <span className="text-text-400 leading-relaxed whitespace-pre-wrap">{text}</span>
            </div>
            <div className="flex flex-col gap-1 px-1">
                {actionItems.map((action, index) => (
                    <Button key={index} variant="secondary" icon={action.icon} tooltip={action.tooltip} onClick={action.onClick} />
                ))}
            </div>
        </div>
    );
};

export default ChatMessageText;
