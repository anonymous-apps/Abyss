import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './sidebar';

interface Breadcrumb {
    name: string;
    url: string;
}

interface PageCrumbedProps {
    children?: React.ReactNode;
    title: string;
    subtitle?: string;
    breadcrumbs?: Breadcrumb[];
}
export const PageCrumbed = ({ children, title, subtitle, breadcrumbs }: PageCrumbedProps) => {
    return (
        <div className="flex flex-row text-text-base h-full w-full bg-background-transparent overflow-y-auto">
            <div className={`w-full px-5 pt-[20px] pb-[60px] mx-auto max-w-5xl `}>
                <h1 className="text-xl font-bold mb-2">{title}</h1>
                {subtitle && <h2 className="text-sm text-text-dark">{subtitle}</h2>}
                {breadcrumbs && (
                    <div className="flex items-center gap-2 text-xs my-2">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={crumb.url}>
                                {index > 0 && <span>/</span>}
                                <Link
                                    to={crumb.url}
                                    className={`hover:underline capitalize ${
                                        index === breadcrumbs.length - 1 ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                                >
                                    {crumb.name}
                                </Link>
                            </React.Fragment>
                        ))}
                    </div>
                )}
                <div className="border-b border-background-light mb-8"></div>
                {children}
                <div className="h-[200px]"></div>
            </div>
        </div>
    );
};
