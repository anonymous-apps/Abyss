import React, { ReactNode } from 'react';

export interface ButtonGroupProps {
    /**
     * Array of buttons to display in the group
     */
    buttons: ReactNode[];
    /**
     * Additional className for styling
     */
    className?: string;
    /**
     * Variant of button group
     */
    variant?: 'default' | 'primary-with-icons';
}

/**
 * ButtonGroup component for displaying a horizontal group of buttons
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({ buttons, className = '', variant = 'default' }) => {
    return (
        <div className={`inline-flex ${className}`}>
            {buttons.map((button, index) => {
                // Clone button element to modify its className
                const child = React.Children.only(button) as React.ReactElement;
                let additionalClass = '';
                let additionalProps: Record<string, any> = {};

                // First button should only round left corners
                if (index === 0) {
                    additionalClass = 'rounded-r-none border-r border-r-primary-300';
                }
                // Last button should only round right corners
                else if (index === buttons.length - 1) {
                    additionalClass = 'rounded-l-none';
                }
                // Middle buttons should have no rounded corners
                else {
                    additionalClass = 'rounded-none border-r border-r-primary-300';
                }

                // Apply variant-specific props
                if (variant === 'primary-with-icons') {
                    additionalProps.variant = 'primary';
                    // If the button doesn't already have an icon, we could handle that here
                    // but we'd need to know what icon to use
                }

                return React.cloneElement(child, {
                    className: `${child.props.className || ''} ${additionalClass}`,
                    key: index,
                    ...additionalProps,
                    ...child.props,
                });
            })}
        </div>
    );
};

export default ButtonGroup;
