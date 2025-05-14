import { useNavigate } from 'react-router';
import { useDatabaseDocuments } from '../../state/database-access-utils';

export function useDocumentsPage() {
    // Navigation
    const navigate = useNavigate();
    const pageBreadcrumbs = [
        { name: 'Home', onClick: () => navigate('/') },
        { name: 'Documents', onClick: () => navigate('/documents') },
    ];

    const documents = useDatabaseDocuments();

    const viewDocument = (id: string) => {
        navigate(`/documents/id/${id}`);
    };

    const systemDocuments = documents.data?.filter(document => document.type === 'system');
    const dynamicDocuments = documents.data?.filter(document => document.type === 'dynamic');
    return { breadcrumbs: pageBreadcrumbs, documents, systemDocuments, dynamicDocuments, viewDocument };
}
