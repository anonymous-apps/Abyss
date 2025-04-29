import { useDatabaseRecord } from './database-connection';

export function useSettings() {
    return useDatabaseRecord('settings', 'default');
}
