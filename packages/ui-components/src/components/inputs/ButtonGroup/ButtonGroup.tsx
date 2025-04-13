import React, { ReactNode } from 'react';

export interface ButtonGroupProps {
    /**
     * Array of buttons to display in the group
     */
    children: ReactNode[];

    /**
     * Additional className for styling
     */
    className?: string;
}

/**
 * ButtonGroup component for displaying a horizontal group of buttons
 */
export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className = '' }) => {
    return (
        <div className={`inline-flex ${className}`}>
            {children.map((button, index) => {
                // Clone button element to modify its className
                const child = React.Children.only(button) as React.ReactElement;
                let additionalClass = '';
                let additionalProps: Record<string, any> = {};

                // First button should only round left corners
                if (index === 0) {
                    additionalClass = '!rounded-r-none border-r border-r-primary-300';
                }
                // Last button should only round right corners
                else if (index === children.length - 1) {
                    additionalClass = '!rounded-l-none';
                }
                // Middle buttons should have no rounded corners
                else {
                    additionalClass = '!rounded-none border-r border-r-primary-300';
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
