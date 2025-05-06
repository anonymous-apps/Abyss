import { useNavigate } from 'react-router';
import { useScanTableTools } from '../../state/database-access-utils';

export function useToolsPage() {
    // Navigation
    const navigate = useNavigate();
    const pageBreadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Tools', onClick: () => navigate('/tools') },
    ];

    const tools = useScanTableTools();
    const systemTools = tools.data?.filter(tool => tool.handlerType === 'abyss');

    const viewTool = (toolId: string) => {
        navigate(`/tools/id/${toolId}`);
    };

    return { breadcrumbs: pageBreadcrumbs, tools, systemTools, viewTool };
}
