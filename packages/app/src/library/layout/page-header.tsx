import { LucideIcon } from 'lucide-react';
import React from 'react';

interface PageHeaderProps {
    children?: React.ReactNode;
    icon?: LucideIcon;
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export const PageHeader = ({ children, title, subtitle, action, icon }: PageHeaderProps) => {
    const Icon = icon;

    return (
        <div className="flex flex-row text-text-300 h-full w-full bg-background-300 overflow-y-auto">
            <div className={`w-full pb-[60px] mx-auto `}>
                <div className="border-b w-full p-4">
                    <div className="max-w-5xl mx-auto w-full  ">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-row items-center gap-2">
                                {Icon && <Icon className="w-6 h-6" />}
                                <h1 className="text-xl font-bold">{title}</h1>
                            </div>
                            {action && <div className="ml-auto">{action}</div>}
                        </div>
                        {subtitle && <h2 className="text-sm text-text-700 mb-2">{subtitle}</h2>}
                    </div>
                </div>
                <div className="max-w-5xl mx-auto p-4">{children}</div>
                <div className="h-[200px]"></div>
            </div>
        </div>
    );
};
