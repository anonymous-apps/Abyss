import { Settings } from 'lucide-react';
import React from 'react';
import Button from '../../inputs/Button/Button';
import { ActionItem } from '../ChatMessageText/ChatMessageText';

export interface ChatMessageSystemTextProps {
    /**
     * System message text content
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

export const ChatMessageSystemText: React.FC<ChatMessageSystemTextProps> = ({ text, actionItems = [], className = '' }) => {
    return (
        <div className={`relative w-full  rounded-sm text-xs rounded ${className}`}>
            <div className="flex-grow flex items-center gap-2 bg-background-200 py-2 px-2">
                <Settings className="w-4 h-4" />
                <span className="text-text-500 whitespace-pre-wrap">{text}</span>
            </div>
            {actionItems.length > 0 && (
                <div className="w-full flex justify-end gap-1 z-10 pointer-events-auto">
                    {actionItems.map((action, index) => (
                        <Button
                            key={index}
                            variant="secondary"
                            icon={action.icon}
                            tooltip={action.tooltip}
                            onClick={action.onClick}
                            className="p-1 h-5 w-5 min-w-0 min-h-0 flex items-center justify-center"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatMessageSystemText;
