import { Loader2, X } from 'lucide-react';
import type React from 'react';
import type { SidebarButtonProps } from './SidebarTypes';

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
                group relative flex items-center px-2 py-1 cursor-pointer select-none font-thin transition-all duration-500
                ${isActive ? 'bg-sidebar-section' : 'hover:bg-background-800'}
                ${className}
            `}
            onClick={onClick}
        >
            <Icon className="h-4 w-4 flex-shrink-0 mr-2" />
            <span className="text-sm flex-grow">{label}</span>

            {isActive && <div className="absolute right-0 w-[2px] h-full bg-primary-500" />}

            {isInProgress && (
                <Loader2
                    className={`absolute right-2 h-4 w-4 animate-spin text-primary-500 ml-2 block stroke-2 ${
                        isClosable ? 'group-hover:hidden' : ''
                    }`}
                />
            )}

            {isClosable && (
                <div
                    className={`absolute right-2 h-5 w-5 p-0.5 px-1 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:text-primary-500 transition-opacity hidden group-hover:block`}
                    onClick={e => {
                        e.stopPropagation();
                        onClose?.();
                    }}
                >
                    <X className="h-4 w-4 stroke-2" />
                </div>
            )}
        </div>
    );
};

export default SidebarButton;
