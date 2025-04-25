import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';
import React, { useState } from 'react';

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
     * Additional CSS class names
     */
    className?: string;
}

export const ChatMessageSystemEvent: React.FC<ChatMessageSystemEventProps> = ({ icon: Icon, text, children, className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = !!children;

    return (
        <div className={`relative w-full rounded-sm text-xs ${className}`}>
            <div
                className={`flex items-center gap-2 py-2 px-2 text-text-500 bg-background-200 rounded
                ${hasChildren ? 'cursor-pointer hover:bg-background-200' : ''}`}
                onClick={() => hasChildren && setIsExpanded(!isExpanded)}
            >
                {hasChildren &&
                    (isExpanded ? <ChevronDown className="w-3 h-3 text-text-400" /> : <ChevronRight className="w-3 h-3 text-text-400" />)}
                <Icon className="w-4 h-4 text-text-500" />
                <span className="">{text}</span>
            </div>

            {isExpanded && children && (
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out py-2 px-2 pl-6 border-l border-background-300 ml-4 mt-1`}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default ChatMessageSystemEvent;
