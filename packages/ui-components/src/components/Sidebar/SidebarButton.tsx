import { Loader2, X } from 'lucide-react';
import React from 'react';
import { SidebarButtonProps } from './SidebarTypes';

/**
 * SidebarButton component for navigation items in the sidebar
 */
export const SidebarButton: React.FC<SidebarButtonProps> = ({
    label,
    icon: Icon,
    isActive = false,
    isClosable = false,
    isInProgress = false,
    onClick,
    onClose,
    className = '',
}) => {
    return (
        <div
            className={`
                group relative flex items-center px-3 py-2 cursor-pointer select-none
                ${isActive ? 'bg-primary-100 text-primary-700' : 'text-text-400 hover:bg-background-200'}
                ${className}
            `}
            onClick={onClick}
        >
            <Icon className="h-4 w-4 flex-shrink-0 mr-2" />
            <span className="text-sm flex-grow">{label}</span>

            {isInProgress && <Loader2 className="h-4 w-4 animate-spin text-primary-500 ml-2" />}

            {isClosable && (
                <div
                    className="h-5 w-5 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-background-300 transition-opacity"
                    onClick={e => {
                        e.stopPropagation();
                        onClose?.();
                    }}
                >
                    <X className="h-3 w-3" />
                </div>
            )}
        </div>
    );
};

export default SidebarButton;
