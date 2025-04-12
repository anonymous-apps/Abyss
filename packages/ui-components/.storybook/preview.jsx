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
        themes: {
            default: 'abyss',
            list: [
                { name: 'abyss', class: 'abyss', color: '#1e1e22' },
                { name: 'etherial', class: 'etherial', color: '#f6f7fa' },
            ],
        },
    },
    decorators: [
        Story => (
            <div className="p-4 bg-background-300 min-h-screen">
                <Story />
            </div>
        ),
    ],
};

export default preview;
