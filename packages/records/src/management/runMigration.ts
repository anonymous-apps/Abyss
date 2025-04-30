import path from 'path';
import { PrismaConnection } from '../prisma';
import { bash } from '../utils/bash';

export async function runDatabaseMigration(connection: PrismaConnection) {
    const cwd = path.join(__dirname, '..', '..', 'records');
    const { result, error } = await bash(
        `export DATABASE_URL=file:~/.abyss/database.sqlite && npx prisma migrate deploy --schema=./prisma/schema.prisma`,
        {
            cwd,
        }
    );

    if (error) {
        throw new Error(error);
    }
    console.log(result);
}
