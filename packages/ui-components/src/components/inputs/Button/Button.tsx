import { Loader2, LucideIcon } from 'lucide-react';
import React, { ButtonHTMLAttributes, useState } from 'react';

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
    /**
     * Optional tooltip text to display on hover
     */
    tooltip?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon: Icon, className = '', ...props }) => {
    // Check if button is icon-only
    const isIconOnly = Icon && !children;

    // Base Styles
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-sm transition-all';
    const paddingStyles = isIconOnly ? 'p-1' : 'px-3 py-1 text-sm';
    const providedStyles = className;

    if (variant === 'primary') {
        return <PrimaryButton {...props} className={`${baseStyles} ${paddingStyles} ${providedStyles}`} children={children} icon={Icon} />;
    }

    if (variant === 'secondary') {
        return (
            <SecondaryButton {...props} className={`${baseStyles} ${paddingStyles} ${providedStyles}`} children={children} icon={Icon} />
        );
    }

    throw new Error('Invalid button variant');
};

const PrimaryButton: React.FC<ButtonProps> = ({
    icon: Icon,
    isLoading = false,
    isDisabled = false,
    className = '',
    children,
    tooltip,
    ...props
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                {...props}
                className={`
                    ${className}
                    ${
                        !isLoading && !isDisabled
                            ? 'bg-primary-500 hover:bg-primary-600 hover:shadow-lg'
                            : 'cursor-not-allowed bg-background-500'
                    }
                    text-text-900
                `}
                disabled={isDisabled || isLoading}
                onMouseEnter={() => tooltip && setShowTooltip(true)}
                onMouseLeave={() => tooltip && setShowTooltip(false)}
            >
                {Icon && <Icon className={`${!children ? 'h-5 w-5' : 'mr-2 h-4 w-4'}`} />}
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
            {tooltip && showTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-primary-300 text-text-100 text-xs rounded shadow-lg whitespace-nowrap z-10">
                    {tooltip}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-primary-300"></div>
                </div>
            )}
        </div>
    );
};

const SecondaryButton: React.FC<ButtonProps> = ({
    icon: Icon,
    isLoading = false,
    isDisabled = false,
    className = '',
    children,
    tooltip,
    ...props
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                {...props}
                className={`
                    ${className}
                    ${!isDisabled ? 'hover:bg-primary-100' : ''}
                    text-primary-500
                `}
                disabled={isDisabled || isLoading}
                onMouseEnter={() => tooltip && setShowTooltip(true)}
                onMouseLeave={() => tooltip && setShowTooltip(false)}
            >
                {Icon && <Icon className={`${!children ? 'h-5 w-5' : 'mr-2 h-4 w-4'}`} />}
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
            {tooltip && showTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-primary-300 text-text-100 text-xs rounded shadow-lg whitespace-nowrap z-10">
                    {tooltip}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-primary-300"></div>
                </div>
            )}
        </div>
    );
};

export default Button;
