const fs = require('fs-extra');
const path = require('path');

const copyPrismaClient = async () => {
    const prismaMigrationsSrc = path.join(__dirname, '..', 'records', 'prisma', 'migrations');
    const prismaMigrationsDest = path.join('prisma', 'migrations');

    const schemaSrc = path.join(__dirname, '..', 'records', 'prisma', 'schema.prisma');
    const schemaDest = path.join('prisma', 'schema.prisma');

    const prismaClientSrc = path.join(__dirname, '..', '..', '..', 'node_modules', '.prisma');
    const prismaClientDest = path.join('node_modules', '.prisma');

    const prismaPkgSrc = path.join(__dirname, '..', '..', '..', 'node_modules', '@prisma');
    const prismaPkgDest = path.join('node_modules', '@prisma');

    console.log('Copying Prisma Client from', prismaClientSrc, 'to', prismaClientDest);
    console.log('Copying Prisma Package from', prismaPkgSrc, 'to', prismaPkgDest);
    console.log('Copying Prisma Migrations from', prismaMigrationsSrc, 'to', prismaMigrationsDest);
    console.log('Copying Prisma Schema from', schemaSrc, 'to', schemaDest);
    try {
        await fs.copy(prismaClientSrc, prismaClientDest);
        await fs.copy(prismaPkgSrc, prismaPkgDest);
        await fs.copy(prismaMigrationsSrc, prismaMigrationsDest);
        await fs.copy(schemaSrc, schemaDest);
        console.log('Prisma client copy complete.');
    } catch (err) {
        console.error('[copy-prisma-client] Error copying Prisma client:', err);
        throw err;
    }
};

copyPrismaClient();
