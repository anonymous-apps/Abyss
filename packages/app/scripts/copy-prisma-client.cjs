const fs = require('fs-extra');
const path = require('path');

const copyPrismaClient = async () => {
    const prismaClientSrc = path.join(__dirname, '..', '..', '..', 'node_modules', '.prisma');
    const prismaClientDest = path.join('node_modules', '.prisma');

    const prismaPkgSrc = path.join(__dirname, '..', '..', '..', 'node_modules', '@prisma');
    const prismaPkgDest = path.join('node_modules', '@prisma');

    console.log('Copying Prisma Client from', prismaClientSrc, 'to', prismaClientDest);
    console.log('Copying Prisma Package from', prismaPkgSrc, 'to', prismaPkgDest);
    try {
        await fs.copy(prismaClientSrc, prismaClientDest);
        await fs.copy(prismaPkgSrc, prismaPkgDest);
        console.log('Prisma client copy complete.');
    } catch (err) {
        console.error('[copy-prisma-client] Error copying Prisma client:', err);
        throw err;
    }
};

copyPrismaClient();
