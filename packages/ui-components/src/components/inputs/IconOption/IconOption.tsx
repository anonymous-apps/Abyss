import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import type { ReactNode } from 'react';

export interface IconOptionProps {
    /**
     * Title text displayed at the top of the option
     */
    title: string;
    /**
     * Lucide icon to display next to the content
     */
    icon: LucideIcon;
    /**
     * Content to display below the title
     */
    children: ReactNode;
    /**
     * Function called when option is clicked
     * If not provided, hover effects won't be shown
     */
    onClick?: () => void;
    /**
     * Is the option disabled
     */
    isDisabled?: boolean;
    /**
     * Additional CSS classes
     */
    className?: string;
}

export const IconOption: React.FC<IconOptionProps> = ({ title, icon: Icon, children, onClick, isDisabled = false, className = '' }) => {
    const isClickable = !!onClick && !isDisabled;

    return (
        <button
            type="button"
            className={`
                flex items-center p-2 rounded-md text-text-200 bg-background-200
                ${isClickable ? 'cursor-pointer hover:bg-background-300' : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed bg-background-300' : ''}
                ${className || ''}
            `}
            onClick={isClickable ? onClick : undefined}
        >
            <Icon size={24} className="mr-4 text-primary-500" />
            <div className="flex-1">
                <h3 className="text-sm xl:text-lg mb-1">{title}</h3>
                <div className="text-xs xl:text-sm">{children}</div>
            </div>
        </button>
    );
};

export default IconOption;
