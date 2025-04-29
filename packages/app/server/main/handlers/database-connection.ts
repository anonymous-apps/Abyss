import { PrismaConnection } from '@abyss/records';
import { AppController } from '../app-controller';

const database = new PrismaConnection();

export function setupDatabaseConnectionHandlers(controller: AppController) {
    controller.addIpcHandler('get-database-tables', () => {
        return database.table;
    });
}
