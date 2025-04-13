import React from 'react';
import { SidebarSectionProps } from './SidebarTypes';

/**
 * SidebarSection component for grouping sidebar content with a title
 */
export const SidebarSection: React.FC<SidebarSectionProps> = ({ title, className = '' }) => {
    return (
        <div className={`mt-4 ${className}`}>
            <div className="py-1 text-xs px-2 font-medium text-background-500 capitalize tracking-wider">{title}</div>
        </div>
    );
};

export default SidebarSection;
