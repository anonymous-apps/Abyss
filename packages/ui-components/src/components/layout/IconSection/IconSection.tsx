import { LucideIcon } from 'lucide-react';
import React from 'react';

export interface IconSectionProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    icon: LucideIcon;
    action?: React.ReactNode;
}

export const IconSection: React.FC<IconSectionProps> = ({ children, title, subtitle, icon: Icon, action }: IconSectionProps) => {
    return (
        <div className="flex flex-col rounded-md p-2 -translate-x-2 mb-8 transition-all duration-300">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                    <Icon className="w-4 h-4 text-primary-500 font-bold" />
                    <h2 className="text-sm font-bold">{title}</h2>
                </div>
                {action}
            </div>
            {subtitle && <div className="text-sm opacity-70 py-1">{subtitle}</div>}
            <div className="mt-4">{children}</div>
        </div>
    );
};

export default IconSection;
