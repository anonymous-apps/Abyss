import { LucideIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

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
        <div
            className={`
                flex items-center p-4 rounded-md transition-all duration-200 w-full
                ${isClickable ? 'border border-transparent hover:bg-primary-100 cursor-pointer' : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed bg-background-300' : ''}
                ${className}
            `}
            onClick={isClickable ? onClick : undefined}
        >
            <Icon size={24} className="mr-4 text-primary-500" />
            <div className="flex-1">
                <h3 className="text-sm xl:text-lg mb-1">{title}</h3>
                <div className="text-xs xl:text-sm">{children}</div>
            </div>
        </div>
    );
};

export default IconOption;
