import { LucideIcon } from 'lucide-react';
import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /**
     * Optional Lucide icon to display inside the input
     */
    icon?: LucideIcon;
    /**
     * Is the input disabled
     */
    isDisabled?: boolean;
}

export const Input: React.FC<InputProps> = ({ icon: Icon, isDisabled = false, className = '', placeholder, ...props }) => {
    const inputId = props.id || `input-${Math.random().toString(36).substring(2, 9)}`;

    // Base styles
    const baseStyles =
        'w-full bg-background-transparent text-text-100 border rounded px-3 py-2 text-sm focus:outline-none transition-colors';
    const iconStyles = Icon ? 'pl-10' : '';
    const disabledStyles = isDisabled ? 'opacity-60 cursor-not-allowed' : '';
    const providedStyles = className;

    return (
        <div className="relative">
            {Icon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-400">
                    <Icon className="h-4 w-4" />
                </div>
            )}
            <input
                id={inputId}
                disabled={isDisabled}
                placeholder={placeholder}
                className={`${baseStyles} border-background-100 focus:border-primary-700 ${iconStyles} ${disabledStyles} ${providedStyles}`}
                {...props}
            />
        </div>
    );
};

export default Input;
