import type React from 'react';
import type { CSSProperties, ReactNode } from 'react';

export interface CenterProps {
    /**
     * Content to be centered
     */
    children: ReactNode;
    /**
     * Optional additional className
     */
    className?: string;
    /**
     * Optional custom styles
     */
    style?: CSSProperties;
}

export const Center: React.FC<CenterProps> = ({ children, className = '', style = {}, ...props }) => {
    const baseStyles = 'flex flex-col items-center justify-center';
    const composedStyles = `${baseStyles} ${className}`;

    return (
        <div className={composedStyles} {...props}>
            {children}
        </div>
    );
};

export default Center;
