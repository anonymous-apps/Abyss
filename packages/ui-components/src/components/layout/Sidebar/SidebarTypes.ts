import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export interface SidebarProps {
    /**
     * Children to render in the sidebar
     */
    children: ReactNode;

    /**
     * Optional title text for the sidebar
     */
    title?: string;

    /**
     * Optional node to render on the right side of the title
     */
    titleAction?: ReactNode;

    /**
     * Width of the sidebar in pixels
     */
    width?: number;

    /**
     * Additional className for styling
     */
    className?: string;
}

export interface SidebarSectionProps {
    /**
     * Title of the section
     */
    title: string;

    /**
     * Additional className for styling
     */
    className?: string;
}

export interface SidebarButtonProps {
    /**
     * Label text for the button
     */
    label: string;

    /**
     * Icon component to display
     */
    icon?: LucideIcon;

    /**
     * Whether the button is in active state
     */
    isActive?: boolean;

    /**
     * Whether the button is closable
     */
    isClosable?: boolean;

    /**
     * Whether the button is in progress (loading)
     */
    isInProgress?: boolean;

    /**
     * Click handler
     */
    onClick?: () => void;

    /**
     * Close handler (only used when isClosable is true)
     */
    onClose?: () => void;
    
    /**
     * Additional className for styling
     */
    className?: string;
}
