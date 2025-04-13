// This file exports theme CSS and constants
import './themes.css';

export const THEME_NAMES = ['abyss', 'etherial'] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

// Simple utility to apply theme to HTML element
export const applyTheme = (theme: ThemeName): void => {
    document.documentElement.setAttribute('data-theme', theme);
};
