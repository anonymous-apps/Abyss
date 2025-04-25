import { Settings } from 'lucide-react';
import React from 'react';

export interface ChatMessageSystemTextProps {
    /**
     * System message text content
     */
    text: string;
    /**
     * Additional CSS class names
     */
    className?: string;
}

export const ChatMessageSystemText: React.FC<ChatMessageSystemTextProps> = ({ text, className = '' }) => {
    return (
        <div className={`relative w-full py-2 px-2 rounded-sm text-xs bg-background-200 rounded ${className}`}>
            <div className="flex-grow flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="text-text-500 whitespace-pre-wrap">{text}</span>
            </div>
        </div>
    );
};

export default ChatMessageSystemText;
