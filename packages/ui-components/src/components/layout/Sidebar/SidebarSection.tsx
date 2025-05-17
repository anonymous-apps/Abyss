import type React from 'react';
import type { SidebarSectionProps } from './SidebarTypes';

/**
 * SidebarSection component for grouping sidebar content with a title
 */
export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, className = '' }) => {
    return (
        <div className={`mt-4 ${className}`}>
            <div className="py-1 text-xs px-2  text-text-700 lowercase tracking-wider display-font">{title}</div>
        </div>
    );
};

export default SidebarSection;
