import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps {
    icon: LucideIcon;
    onClick?: () => void;
    className?: string;
    label?: string;
    disabled?: boolean;
    borderless?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon: Icon,
    onClick,
    className = '',
    label,
    disabled = false,
    borderless = false,
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-1 px-3 border border-primary-light rounded transition-colors flex gap-3 items-center bg-background-transparent ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-base hover:text-primary-base'
            } ${className} ${borderless ? 'border-none' : ''}`}
        >
            <Icon size={18} />
            {label && <div className="text-sm">{label}</div>}
        </button>
    );
};

interface ButtonProps {
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
    selected?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ onClick, className = '', children, disabled = false, selected = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={` text-sm px-3 py-1 border border-primary-light rounded transition-colors bg-background-transparent ${
                disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : selected
                    ? 'border-primary-base text-text-light bg-primary-base bg-background-transparent'
                    : 'hover:bg-primary-base hover:text-text-light'
            } ${className}`}
        >
            {children}
        </button>
    );
};

interface GhostButtonProps {
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export const GhostButton: React.FC<GhostButtonProps> = ({ onClick, className = '', children, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`text-sm px-3 py-1 border border-transparent rounded transition-colors bg-transparent ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-light hover:text-primary-base'
            } ${className}`}
        >
            {children}
        </button>
    );
};

interface DestructiveButtonProps {
    onClick?: () => void;
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
}

export const DestructiveButton: React.FC<DestructiveButtonProps> = ({ onClick, className = '', children, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-fit px-3 py-1 text-sm text-white bg-red-500 bg-opacity-20 border border-red-900 rounded-sm transition-colors bg-background-transparent ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600 hover:border-red-600'
            } ${className}`}
        >
            {children}
        </button>
    );
};

interface GhostIconButtonProps {
    onClick?: () => void;
    className?: string;
    icon: LucideIcon;
    label?: string;
    tooltip?: string;
    disabled?: boolean;
}

export const GhostIconButton: React.FC<GhostIconButtonProps> = ({
    onClick,
    className = '',
    icon: Icon,
    label,
    tooltip,
    disabled = false,
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                onClick={onClick}
                disabled={disabled}
                onMouseEnter={() => tooltip && setShowTooltip(true)}
                onMouseLeave={() => tooltip && setShowTooltip(false)}
                className={`flex items-center gap-2 text-sm px-1 py-1 border border-transparent rounded transition-colors bg-transparent ${
                    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-light hover:text-primary-base'
                } ${className}`}
            >
                <Icon className="w-4 h-4" />
                {label && <span>{label}</span>}
            </button>
            {tooltip && showTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-primary-base text-text-light text-xs rounded shadow-lg whitespace-nowrap z-10">
                    {tooltip}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-primary-base"></div>
                </div>
            )}
        </div>
    );
};
