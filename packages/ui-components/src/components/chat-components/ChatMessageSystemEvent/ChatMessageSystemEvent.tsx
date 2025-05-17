import { ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import Button from '../../inputs/Button/Button';
import type { ActionItem } from '../ChatMessageText/ChatMessageText';

export interface ChatMessageSystemEventProps {
    /**
     * Icon to display with the event message
     */
    icon: LucideIcon;
    /**
     * Event message text
     */
    text: string;
    /**
     * Child content to display when expanded
     */
    children?: React.ReactNode;
    /**
     * Action items to display alongside the message
     */
    actionItems?: ActionItem[];
    /**
     * Additional CSS class names
     */
    className?: string;
}

export const ChatMessageSystemEvent: React.FC<ChatMessageSystemEventProps> = ({
    icon: Icon,
    text,
    children,
    actionItems = [],
    className = '',
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = !!children;

    return (
        <div className={`relative w-full rounded-sm text-xs ${className}`}>
            <button
                type="button"
                className={`flex items-center gap-2 py-2 px-2 text-text-500 bg-background-200 w-full text-left 
                    ${isExpanded ? 'rounded-t border-b border-background-300' : 'rounded'}
                ${hasChildren ? 'cursor-pointer hover:bg-background-200' : ''}`}
                onClick={() => hasChildren && setIsExpanded(!isExpanded)}
                onKeyDown={e => {
                    if (hasChildren && (e.key === 'Enter' || e.key === ' ')) {
                        setIsExpanded(!isExpanded);
                    }
                }}
            >
                {hasChildren &&
                    (isExpanded ? <ChevronDown className="w-3 h-3 text-text-400" /> : <ChevronRight className="w-3 h-3 text-text-400" />)}
                <Icon className="w-4 h-4 text-text-500" />
                <span className="">{text}</span>
            </button>

            {isExpanded && children && (
                <div className="overflow-hidden transition-all duration-300 ease-in-out py-2 px-2 px-6 bg-background-200 pt-1 rounded-b">
                    {children}
                </div>
            )}

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

export default ChatMessageSystemEvent;
