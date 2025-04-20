import { Meta, StoryObj } from '@storybook/react';
import { FileText, Home, List, Settings, Users } from 'lucide-react';

// Import components
import { IconSection } from './content/IconSection/IconSection';
import { Tile } from './content/Tile/Tile';
import { LabelValue } from './data/LabelValue/LabelValue';
import { Table } from './data/Table/Table';
import { Button } from './inputs/Button/Button';
import { PageCrumbed } from './layout/PageCrumbed/PageCrumbed';
import { Sidebar } from './layout/Sidebar/Sidebar';
import { SidebarButton } from './layout/Sidebar/SidebarButton';
import { SidebarSection } from './layout/Sidebar/SidebarSection';

const meta: Meta = {
    title: 'Pages/App Demo',
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj;

// Sample data for the table
const sampleData = [
    { id: 1, name: 'Project Alpha', status: 'Active', owner: 'John Doe', lastUpdated: '2023-10-15' },
    { id: 2, name: 'Project Beta', status: 'Completed', owner: 'Jane Smith', lastUpdated: '2023-09-22' },
    { id: 3, name: 'Project Gamma', status: 'In Progress', owner: 'Alex Johnson', lastUpdated: '2023-10-10' },
    { id: 4, name: 'Project Delta', status: 'On Hold', owner: 'Emily Davis', lastUpdated: '2023-08-30' },
    { id: 5, name: 'Project Epsilon', status: 'Planning', owner: 'Michael Brown', lastUpdated: '2023-10-18' },
];

// Sample project details data
const projectDetails = {
    Status: 'Active',
    Created: 'October 15, 2023',
    Owner: 'John Doe',
    Priority: 'High',
    'API Key': 'a1b2c3d4-e5f6-g7h8',
};

export const AppDemo: Story = {
    render: () => {
        return (
            <div className="flex h-screen w-full overflow-hidden">
                {/* Sidebar */}
                <Sidebar title="Abyss" width={200}>
                    <SidebarSection key="main" title="Main" />
                    <SidebarButton icon={Home} label="Dashboard" isActive />
                    <SidebarButton icon={FileText} label="Projects" />
                    <SidebarButton icon={Users} label="Team" />
                    <SidebarButton icon={List} label="Tasks" isInProgress />
                    <SidebarSection key="admin" title="Admin" />
                    <SidebarButton icon={Settings} label="Settings" isInProgress isClosable />
                </Sidebar>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden">
                    <PageCrumbed
                        title="Projects Dashboard"
                        subtitle="Manage and monitor all your projects"
                        breadcrumbs={[
                            { name: 'Home', onClick: () => console.log('Home clicked') },
                            { name: 'Projects', onClick: () => console.log('Projects clicked') },
                        ]}
                        actions={
                            <div className="flex gap-2">
                                <Button variant="secondary">Export</Button>
                                <Button variant="primary" icon={FileText}>
                                    New Project
                                </Button>
                            </div>
                        }
                    >
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <Tile title="Active Projects">
                                <div className="text-3xl font-bold text-primary-500">12</div>
                                <div className="text-xs text-text-600">2 more than last month</div>
                            </Tile>

                            <Tile title="Team Members">
                                <div className="text-3xl font-bold text-primary-500">8</div>
                                <div className="text-xs text-text-600">1 new this month</div>
                            </Tile>

                            <Tile title="Completion Rate">
                                <div className="text-3xl font-bold text-primary-500">87%</div>
                                <div className="text-xs text-text-600">5% increase</div>
                            </Tile>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="col-span-2">
                                <h2 className="text-lg font-medium mb-2">Project List</h2>
                                <Table data={sampleData} onRowClick={row => console.log('Row clicked:', row)} />
                            </div>

                            <div>
                                <IconSection title="Project Details" icon={FileText}>
                                    <div className="space-y-4">
                                        <LabelValue data={projectDetails} />
                                        <div className="mt-4">
                                            <Button variant="secondary" className="w-full">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </IconSection>
                            </div>
                        </div>
                    </PageCrumbed>
                </div>
            </div>
        );
    },
};
