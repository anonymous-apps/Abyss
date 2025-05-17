import { Check, Circle, Loader2, MessageCircleQuestion, X } from 'lucide-react';
import type React from 'react';

export type StatusType = 'notStarted' | 'inProgress' | 'success' | 'failed';

export interface StatusProps {
    /**
     * The status to display
     */
    status: StatusType;
    /**
     * Additional CSS class names
     */
    className?: string;
}

export const Status: React.FC<StatusProps> = ({ status, className = '' }) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'notStarted':
                return {
                    icon: Circle,
                    color: 'text-text-500',
                    text: 'Not Started',
                };
            case 'inProgress':
                return {
                    icon: Loader2,
                    color: 'text-text-500',
                    text: 'In Progress',
                };
            case 'success':
                return {
                    icon: Check,
                    color: 'text-green-500',
                    text: 'Success',
                };
            case 'failed':
                return {
                    icon: X,
                    color: 'text-red-500',
                    text: 'Failed',
                };
        }

        return {
            icon: MessageCircleQuestion,
            color: 'text-text-500',
            text: status,
        };
    };

    const { icon: Icon, color, text } = getStatusConfig();

    return (
        <div className={`inline-flex items-center gap-1 ${className}`}>
            {status === 'inProgress' ? <Icon className={`w-4 h-4 animate-spin ${color}`} /> : <Icon className={`w-4 h-4 ${color}`} />}
            <span className={`text-sm ${color}`}>{text}</span>
        </div>
    );
};
