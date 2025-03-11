import { ActionDefinitionsController } from '../controllers/action-definitions';
import { UserSettingsController } from '../controllers/user-settings';
import { prisma } from '../database-connection';

export const PrismaBoostrapper = {
    bootstrapDB: async () => {
        await ActionDefinitionsController.create({
            name: 'Propose NodeJs Action',
            type: 'SYSTEM',
            owner: 'SYSTEM',
            description: 'Allow the AI to write a new NodeJS script, save it to disk, and register it as an action.',
        });
        await UserSettingsController.update({
            bootstrapped: true,
        });
    },
};
