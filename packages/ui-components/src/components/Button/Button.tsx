import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Button variant
     */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    /**
     * Button size
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Optional icon to display before the button text
     */
    leftIcon?: React.ReactNode;
    /**
     * Optional icon to display after the button text
     */
    rightIcon?: React.ReactNode;
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
    size = 'md',
    leftIcon,
    rightIcon,
    isLoading = false,
    isDisabled = false,
    className = '',
    ...props
}) => {
    // Base button styles
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors';

    // Size styles
    const sizeStyles = {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    // Variant styles
    const variantStyles = {
        primary: 'bg-primary-500 text-text-100 hover:bg-primary-600 focus:ring-2 focus:ring-primary-300',
        secondary: 'bg-background-400 text-text-100 hover:bg-background-500 focus:ring-2 focus:ring-background-200',
        outline: 'border border-primary-500 text-primary-500 hover:bg-primary-500/10 focus:ring-2 focus:ring-primary-300',
        ghost: 'text-primary-500 hover:bg-primary-500/10 focus:ring-2 focus:ring-primary-300',
    };

    // Disabled styles
    const disabledStyles = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${className}`}
            disabled={isDisabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            )}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
};

export default Button;
