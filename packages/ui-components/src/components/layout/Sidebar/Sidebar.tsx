import React from 'react';
import { SidebarProps } from './SidebarTypes';

/**
 * Sidebar component for displaying a vertical navigation menu
 */
export const Sidebar: React.FC<SidebarProps> = ({ children, title, titleAction, width = 150, className = '' }) => {
    return (
        <div className={`flex flex-col bg-background-100 h-full ${className}`} style={{ width: `${width}px` }}>
            {title && (
                <div className="flex items-center justify-between p-3 border-b border-background-300">
                    <h2 className="font-medium">{title}</h2>
                    {titleAction && <div className="ml-2">{titleAction}</div>}
                </div>
            )}
            <div className="flex flex-col flex-1 overflow-y-auto">{children}</div>
        </div>
    );
};

export default Sidebar;
