import React from 'react';
import { SidebarSectionProps } from './SidebarTypes';

/**
 * SidebarSection component for grouping sidebar content with a title
 */
export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`mb-2 ${className}`}>
            <div className="px-3 py-1 text-xs font-medium text-background-500 uppercase tracking-wider">{title}</div>
            <div className="mt-1">{children}</div>
        </div>
    );
};

export default SidebarSection;
