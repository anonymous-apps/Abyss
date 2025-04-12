import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface TileProps {
    title: string;
    href: string;
    icon?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
}

export function Tile({ title, href, icon, children, footer }: TileProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(href);
    };

    return (
        <div
            className={`
                relative w-[300px] h-[150px] rounded p-2 flex flex-col cursor-pointer transition-all duration-200 border border-background-dark hover:border-primary-base bg-background-transparent
                
            `}
            onClick={handleClick}
        >
            <div className="flex items-center mb-2 capitalize overflow-hidden">
                {icon && <div className="text-primary mr-2">{icon}</div>}
                <h3 className="text-sm font-semibold truncate">{title}</h3>
            </div>
            {children && (
                <div className="text-sm text-gray-600 overflow-hidden overflow-ellipsis line-clamp-3 max-h-[60px]">{children}</div>
            )}
            {footer && <div className="text-sm text-gray-500 absolute bottom-2 right-2 truncate max-w-[90%]">{footer}</div>}
        </div>
    );
}

interface TileGridProps {
    children: ReactNode;
    className?: string;
}

export function TileGrid({ children, className = '' }: TileGridProps) {
    return <div className={`flex flex-wrap gap-4 mb-4 ${className}`}>{children}</div>;
}
