import type React from 'react';
import type { ReactNode } from 'react';

export interface TileProps {
    /**
     * The title of the tile
     */
    title: string;
    /**
     * Optional icon to display next to the title
     */
    icon?: ReactNode;
    /**
     * Main content of the tile
     */
    children?: ReactNode;
    /**
     * Optional footer content positioned at the bottom right
     */
    footer?: ReactNode;
    /**
     * Handler for click events
     */
    onClick?: () => void;
    /**
     * Additional CSS classes
     */
    className?: string;
}
export const Tile: React.FC<TileProps> = ({ title, icon, children, footer, onClick, className = '' }) => {
    const isClickable = onClick !== undefined;

    return (
        <div
            className={`
                relative w-[300px] h-[150px] rounded-sm p-2 flex flex-col transition-all duration-200 
                border border-background-400 bg-background-100
                ${isClickable ? 'cursor-pointer hover:border-primary-500' : ''}
                ${className}
            `}
            onClick={isClickable ? onClick : undefined}
        >
            <div className="flex items-center mb-2 capitalize overflow-hidden">
                {icon && <div className="text-primary-500 mr-2">{icon}</div>}
                <h3 className="text-sm font-semibold truncate">{title}</h3>
            </div>
            {children && (
                <div className="text-xs text-text-300 overflow-hidden overflow-ellipsis line-clamp-3 max-h-[60px]">{children}</div>
            )}
            {footer && <div className="text-sm text-text-300 absolute bottom-2 right-2 truncate max-w-[90%]">{footer}</div>}
        </div>
    );
};

export interface TileGridProps {
    /**
     * Tile components to display in a grid
     */
    children: ReactNode;
    /**
     * Additional CSS classes
     */
    className?: string;
}

export const TileGrid: React.FC<TileGridProps> = ({ children, className = '' }) => {
    return <div className={`flex flex-wrap gap-4 mb-4 ${className}`}>{children}</div>;
};

export default Tile;
