import { useNavigate } from 'react-router-dom';
import { useScanTableDocument } from '../../state/database-connection';

export function useDocumentsPage() {
    const documents = useScanTableDocument();
    const navigate = useNavigate();

    return {
        documents,
        navigate,
    };
}
