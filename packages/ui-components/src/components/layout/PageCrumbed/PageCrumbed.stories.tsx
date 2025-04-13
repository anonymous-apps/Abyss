import { Meta, StoryObj } from '@storybook/react';
import { Save } from 'lucide-react';
import { BrowserRouter } from 'react-router-dom';
import Button from '../../inputs/Button';
import PageCrumbed from './PageCrumbed';

// Meta information for the component
const meta: Meta<typeof PageCrumbed> = {
    title: 'Layout/PageCrumbed',
    component: PageCrumbed,
    parameters: {
        layout: 'fullscreen',
    },
    decorators: [
        Story => (
            <BrowserRouter>
                <Story />
            </BrowserRouter>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof PageCrumbed>;

// Basic example
export const Default: Story = {
    args: {
        title: 'Page Title',
        subtitle: 'Page subtitle with additional information',
        children: <div className="p-4 bg-background-100 rounded">Page Content Goes Here</div>,
    },
};

// With breadcrumbs
export const WithBreadcrumbs: Story = {
    args: {
        title: 'Nested Page',
        subtitle: 'A page with breadcrumb navigation',
        breadcrumbs: [
            { name: 'home', onClick: () => console.log('home clicked') },
            { name: 'section', onClick: () => console.log('section clicked') },
            { name: 'nested page', onClick: () => console.log('nested page clicked') },
        ],
        children: <div className="p-4 bg-background-100 rounded">Page Content With Breadcrumb Navigation</div>,
    },
};

// With icon and actions
export const WithIconAndActions: Story = {
    args: {
        title: 'Page With Icon & Actions',
        subtitle: 'A page with an icon and action buttons',
        icon: <Save />,
        actions: <Button icon={Save} />,
        children: <div className="p-4 bg-background-100 rounded">Page Content With Icon And Actions</div>,
    },
};

// With loading state
export const Loading: Story = {
    args: {
        title: 'Loading Page',
        subtitle: 'This page is currently loading its content',
        loading: true,
        children: <div className="p-4 bg-background-100 rounded">This content will not be shown while loading</div>,
    },
};
