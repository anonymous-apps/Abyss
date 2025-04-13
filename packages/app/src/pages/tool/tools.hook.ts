import { useNavigate } from 'react-router-dom';
import { useScanTableTool } from '../../state/database-connection';

/**
 * Hook for ToolsPage component
 */
export function useToolsPage() {
    const tools = useScanTableTool();
    const navigate = useNavigate();

    const navigateToCreate = () => navigate('/tools/create');

    const navigateToHome = () => {
        navigate('/');
    };

    const navigateToTools = () => {
        navigate('/tools');
    };

    const navigateToTool = (id: string) => {
        navigate(`/tools/id/${id}`);
    };

    const breadcrumbs = [
        { name: 'Home', onClick: navigateToHome },
        { name: 'Tools', onClick: navigateToTools },
    ];

    return {
        tools,
        navigateToCreate,
        breadcrumbs,
        navigateToTool,
    };
}
