import { LucideIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

interface ClickableIconOptionProps {
    title: string;
    icon: LucideIcon;
    children: ReactNode;
    onClick: () => void;
}

export const ClickableIconOption: React.FC<ClickableIconOptionProps> = ({ title, icon: Icon, children, onClick }) => {
    return (
        <div
            className="flex items-center p-4 rounded-md transition-all duration-200 
                border border-transparent hover:border-background-700 hover:shadow-sm
                cursor-pointer"
            onClick={onClick}
        >
            <Icon size={24} className="mr-4 text-primary-100" />
            <div className="flex-1">
                <h3 className="text-sm xl:text-lg mb-1">{title}</h3>
                <div className="text-xs xl:text-sm">{children}</div>
            </div>
        </div>
    );
};
