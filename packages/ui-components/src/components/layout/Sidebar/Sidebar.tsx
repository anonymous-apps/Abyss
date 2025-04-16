import React from 'react';
import { SidebarProps } from './SidebarTypes';

/**
 * Sidebar component for displaying a vertical navigation menu
 */
export const Sidebar: React.FC<SidebarProps> = ({ children, title, titleAction, width = 150, className = '' }) => {
    return (
        <div
            className={`text-sidebar-text flex flex-col bg-sidebar-background h-full border-r border-background-900 ${className}`}
            style={{ width: `${width}px` }}
        >
            {title && (
                <div className="flex items-center justify-between p-3 border-b border-background-700">
                    <h2 className="font-medium text-text-600 display-font w-full text-center pt-1">{title}</h2>
                    {titleAction && <div className="ml-2">{titleAction}</div>}
                </div>
            )}
            <div className="flex flex-col flex-1 overflow-y-auto">{children}</div>
        </div>
    );
};

export default Sidebar;
