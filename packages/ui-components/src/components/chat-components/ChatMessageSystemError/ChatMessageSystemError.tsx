import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import Button from '../../inputs/Button/Button';
import { ActionItem } from '../ChatMessageText/ChatMessageText';

export interface ChatMessageSystemErrorProps {
    /**
     * Error message text
     */
    text: string;
    /**
     * Child content to display when expanded (error details)
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

export const ChatMessageSystemError: React.FC<ChatMessageSystemErrorProps> = ({ text, children, actionItems = [], className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = !!children;

    return (
        <div className={`relative w-full rounded-sm text-xs ${className}`}>
            <div
                className={`flex items-center gap-2 py-2 px-2 text-red-700 bg-red-200  border-red-300 
                    ${isExpanded ? 'rounded-t border-t border-l border-r border-red-300' : 'rounded border'} 
                ${hasChildren ? 'cursor-pointer hover:bg-red-100' : ''}`}
                onClick={() => hasChildren && setIsExpanded(!isExpanded)}
            >
                {hasChildren &&
                    (isExpanded ? <ChevronDown className="w-3 h-3 text-red-600" /> : <ChevronRight className="w-3 h-3 text-red-600" />)}
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="">{text}</span>
            </div>

            {isExpanded && children && (
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out py-2 px-2 pl-6 bg-red-100 pl-4 pt-2 rounded-b  border-x border-b border-red-300`}
                >
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

export default ChatMessageSystemError;
