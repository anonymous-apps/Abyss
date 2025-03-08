/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'variant',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/@tremor/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                background: {
                    light: 'var(--color-background-light)',
                    base: 'var(--color-background-base)',
                    slightlyDark: 'var(--color-background-slightly-dark)',
                    dark: 'var(--color-background-dark)',
                },
                primary: {
                    light: 'var(--color-primary-light)',
                    base: 'var(--color-primary-base)',
                    dark: 'var(--color-primary-dark)',
                },
                text: {
                    light: 'var(--color-text-light)',
                    base: 'var(--color-text-base)',
                    dark: 'var(--color-text-dark)',
                },
                header: 'var(--color-header)',
            },
        },
    },
    plugins: [require('@headlessui/tailwindcss')],
};
