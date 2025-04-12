import React from 'react';
import { Sidebar, SidebarItem, SidebarItemProps } from './sidebar';

interface PageSidebarProps {
    items: SidebarItemProps[];
    children: React.ReactNode;
    header?: React.ReactNode;
}

export function PageSidebar({ items, children, header }: PageSidebarProps) {
    return (
        <div className="flex flex-row overflow-hidden h-[100vh]">
            <Sidebar />
            <div className="left-0 top-0 w-[250px] h-screen flex flex-col gap-1 bg-background-100">
                {header}
                {items.map((item, index) => (
                    <SidebarItem key={index} {...item} />
                ))}
                {items.length === 0 && (
                    <div className="flex flex-col gap-1">
                        <div className="text-xs rounded-sm py-1 mt-5 mb-1 px-2 text-center">Nothing here yet</div>
                    </div>
                )}
            </div>
            <div className="w-full h-full overflow-y-auto bg-background-transparent">{children}</div>
        </div>
    );
}
