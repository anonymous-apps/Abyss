import { Loader2, LucideIcon } from 'lucide-react';
import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Button variant
     */
    variant?: 'primary' | 'secondary';
    /**
     * Optional Lucide icon to display before the button text
     */
    icon?: LucideIcon;
    /**
     * Is the button in a loading state
     */
    isLoading?: boolean;
    /**
     * Is the button disabled
     */
    isDisabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    icon: Icon,
    isLoading = false,
    isDisabled = false,
    className = '',
    ...props
}) => {
    // Check if button is icon-only
    const isIconOnly = Icon && !children;

    // Base button styles
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all';

    // Padding styles based on whether the button is icon-only
    const paddingStyles = isIconOnly ? 'p-1' : 'px-3 py-1 text-sm';

    // Variant styles
    const variantStyles = {
        primary: 'bg-primary-500 text-text-900 hover:bg-primary-600 hover:shadow-lg',
        secondary: 'text-primary-500 hover:border hover:border-primary-500 hover:bg-primary-500/5',
    };

    // Disabled styles
    const disabledStyles = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            className={`${baseStyles} ${paddingStyles} ${variantStyles[variant]} ${disabledStyles} ${className}`}
            disabled={isDisabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className={`${isIconOnly ? 'h-5 w-5' : 'mr-2 h-4 w-4'} animate-spin`} />}
            {!isLoading && Icon && <Icon className={`${isIconOnly ? 'h-5 w-5' : 'mr-2 h-4 w-4'}`} />}
            {children}
        </button>
    );
};

export default Button;
