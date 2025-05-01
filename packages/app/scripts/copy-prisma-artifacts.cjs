const fs = require('fs-extra');
const path = require('path');

const copyPrismaArtifacts = async () => {
    const prismaMigrationsSrc = path.join(__dirname, '..', '..', 'records', 'prisma');
    const prismaMigrationsDest = path.join('prisma');

    console.log('Copying Prisma Migrations from', prismaMigrationsSrc, 'to', prismaMigrationsDest);
    try {
        await fs.copy(prismaMigrationsSrc, prismaMigrationsDest);
        console.log('Prisma client copy complete.');
    } catch (err) {
        console.error('[copy-prisma-client] Error copying Prisma artifacts:', err);
        throw err;
    }
};

copyPrismaArtifacts();
