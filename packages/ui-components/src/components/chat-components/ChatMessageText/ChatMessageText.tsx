import type { LucideIcon } from 'lucide-react';
import type React from 'react';
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
        <div className={`relative w-full py-2 px-2 rounded-sm text-xs ${className}`}>
            <div className="flex-grow">
                <span className="text-text-400 leading-relaxed whitespace-pre-wrap">{text}</span>
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

export default ChatMessageText;
