import React from 'react';
import '../src/styles/index.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        backgrounds: { disable: true },
        layout: 'centered',
        theme: {
            default: 'abyss',
            selector: 'select',
            list: [
                { name: 'Abyss', value: 'abyss' },
                { name: 'ethereal', value: 'ethereal' },
            ],
        },
    },
    decorators: [
        (Story, context) => {
            const selectedTheme = context.globals.theme || 'abyss';

            // Create theme-specific styles
            const containerStyles = {
                width: 'calc(100vw - 16px)',
                height: 'calc(100vh - 16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: selectedTheme === 'abyss' ? '#2d2d33' : '#f8f8f8',
                color: selectedTheme === 'abyss' ? '#e6e6e6' : '#333333',
            };

            React.useEffect(() => {
                const storybookRoot = document.getElementById('storybook-root');
                if (storybookRoot) {
                    storybookRoot.style.padding = '0';
                }
            }, []);

            return (
                <div data-theme={selectedTheme} style={containerStyles}>
                    <Story />
                </div>
            );
        },
    ],
    globalTypes: {
        theme: {
            name: 'Theme',
            description: 'Global theme for components',
            defaultValue: 'abyss',
            toolbar: {
                icon: 'paintbrush',
                items: [
                    { value: 'abyss', title: 'Abyss' },
                    { value: 'ethereal', title: 'ethereal' },
                ],
            },
        },
    },
};

export default preview;
