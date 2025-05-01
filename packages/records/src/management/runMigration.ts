import path from 'path';
import { PrismaConnection } from '../prisma';
import { bash } from '../utils/bash';

export async function runDatabaseMigration(connection: PrismaConnection) {
    const cwd = path.join(__dirname, '..', '..', 'records');
    if (cwd.includes('app.asar')) {
        const unpacked = cwd.replace('app.asar', 'app.asar.unpacked') + '/dist';
        console.log('Running database migration at', unpacked);
        const binary = path.join(unpacked, '../../../prisma/build/index.js ');
        console.log('Using binary', binary);
        const schema = path.join(unpacked, 'schema.prisma');
        console.log('Using schema', schema);
        const { result, error } = await bash(
            `export DATABASE_URL=file:~/.abyss/database.sqlite && node "${binary}" deploy --schema="${schema}"`,
            { cwd: unpacked }
        );
        console.error(error);
        if (error) {
            throw error;
        }
        return;
    }

    console.log('Running database migration at', cwd);
    const { result, error } = await bash(
        `export DATABASE_URL=file:~/.abyss/database.sqlite && node ../../../.prisma/client/migrate deploy --schema=./prisma/schema.prisma`,
        {
            cwd,
        }
    );

    if (error) {
        throw new Error(error);
    }
    console.log(result);
}
