/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    // This allows the component library to use the same theme as the app
    theme: {
        extend: {
            colors: {
                background: {
                    100: 'var(--color-background-100)',
                    200: 'var(--color-background-200)',
                    300: 'var(--color-background-300)',
                    400: 'var(--color-background-400)',
                    500: 'var(--color-background-500)',
                    600: 'var(--color-background-600)',
                    700: 'var(--color-background-700)',
                    800: 'var(--color-background-800)',
                    900: 'var(--color-background-900)',
                    transparent: 'var(--color-background-transparent)',
                },
                primary: {
                    100: 'var(--color-primary-100)',
                    200: 'var(--color-primary-200)',
                    300: 'var(--color-primary-300)',
                    400: 'var(--color-primary-400)',
                    500: 'var(--color-primary-500)',
                    600: 'var(--color-primary-600)',
                    700: 'var(--color-primary-700)',
                    800: 'var(--color-primary-800)',
                    900: 'var(--color-primary-900)',
                },
                text: {
                    100: 'var(--color-text-100)',
                    200: 'var(--color-text-200)',
                    300: 'var(--color-text-300)',
                    400: 'var(--color-text-400)',
                    500: 'var(--color-text-500)',
                    600: 'var(--color-text-600)',
                    700: 'var(--color-text-700)',
                    800: 'var(--color-text-800)',
                    900: 'var(--color-text-900)',
                },
                header: 'var(--color-header)',
                sidebar: {
                    background: 'var(--color-sidebar)',
                    section: 'var(--color-sidebar-section)',
                    text: 'var(--color-sidebar-text)',
                },
            },
        },
    },
    plugins: [
        ({ addBase, theme }) => {
            addBase({
                'input[type="checkbox"]': {
                    accentColor: theme('colors.primary.500'),
                },
            });
        },
    ],
    corePlugins: {
        accent: true,
    },
};
