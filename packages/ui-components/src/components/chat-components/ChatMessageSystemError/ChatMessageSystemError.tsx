import { AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

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
     * Additional CSS class names
     */
    className?: string;
}

export const ChatMessageSystemError: React.FC<ChatMessageSystemErrorProps> = ({ text, children, className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = !!children;

    return (
        <div className={`relative w-full rounded-sm text-xs ${className}`}>
            <div
                className={`flex items-center gap-2 py-2 px-2 text-red-700 bg-red-200 border border-red-300 rounded
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
                    className={`overflow-hidden transition-all duration-300 ease-in-out py-2 px-2 pl-6 border-l border-red-300 ml-4 mt-1 text-red-700`}
                >
                    {children}
                </div>
            )}
        </div>
    );
};

export default ChatMessageSystemError;
