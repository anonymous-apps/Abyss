import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Theme = 'abyss' | 'etherial';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = 'abyss' }) => {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeProvider;
