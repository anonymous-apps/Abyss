import { useNavigate } from 'react-router-dom';
import { useScanTableModelConnections } from '../../state/database-connection';

export function useModelProfileMain() {
    const modelProfiles = useScanTableModelConnections();
    const navigate = useNavigate();

    const handleCreateNew = () => {
        navigate('/models/create');
    };

    const navigateToHome = () => {
        navigate('/');
    };

    const navigateToModels = () => {
        navigate('/models');
    };

    const navigateToModelDetail = (modelId: string) => {
        navigate(`/models/id/${modelId}`);
    };

    const breadcrumbs = [
        { name: 'Home', onClick: navigateToHome },
        { name: 'Models', onClick: navigateToModels },
    ];

    return {
        modelProfiles,
        handleCreateNew,
        breadcrumbs,
        navigateToHome,
        navigateToModels,
        navigateToModelDetail,
    };
}
