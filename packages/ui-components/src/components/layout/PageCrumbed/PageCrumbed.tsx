import { Loader2 } from 'lucide-react';
import React from 'react';

export interface Breadcrumb {
    name: string;
    onClick: () => void;
}

export interface PageCrumbedProps {
    /**
     * Content of the page
     */
    children?: React.ReactNode;
    /**
     * Page title
     */
    title: string;
    /**
     * Optional page subtitle
     */
    subtitle?: string;
    /**
     * Optional breadcrumbs for navigation
     */
    breadcrumbs?: Breadcrumb[];
    /**
     * Optional icon for the page
     */
    icon?: React.ReactNode;
    /**
     * Optional actions to display (right-aligned)
     */
    actions?: React.ReactNode;
    /**
     * Whether the page content is in a loading state
     */
    loading?: boolean;
}

export const PageCrumbed: React.FC<PageCrumbedProps> = ({ children, title, subtitle, breadcrumbs, icon, actions, loading = false }) => {
    return (
        <div className="flex flex-row text-text-300 h-full w-full bg-background-300 overflow-y-scroll scrollbar-gutter-stable base-font">
            <div className={'w-full px-5 pt-[20px] pb-[60px] mx-auto max-w-5xl '}>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        {icon && <div className="mr-2">{icon}</div>}
                        <h1 className="text-xl font-bold">{title}</h1>
                    </div>
                    {actions && <div className="flex">{actions}</div>}
                </div>
                {subtitle && <h2 className="text-sm text-text-600">{subtitle}</h2>}
                {breadcrumbs && (
                    <div className="flex items-center gap-2 text-xs my-2">
                        {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                                {index > 0 && <span>/</span>}
                                <button
                                    type="button"
                                    onClick={crumb.onClick}
                                    className={`hover:underline capitalize ${
                                        index === breadcrumbs.length - 1
                                            ? 'text-text-600 pointer-events-none'
                                            : 'font-bold hover:text-primary-500'
                                    }`}
                                >
                                    {crumb.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                )}
                <div className="border-b border-background-500 mb-2" />
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                    </div>
                ) : (
                    children
                )}
                <div className="h-[200px]" />
            </div>
        </div>
    );
};

export default PageCrumbed;
