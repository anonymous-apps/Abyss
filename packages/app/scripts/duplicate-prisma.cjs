const fs = require('fs-extra');
const path = require('path');

module.exports = async function duplicatePrisma(context) {
    const prismaSrc = path.join(context.outDir, '..', '..', '..', 'node_modules', 'prisma');
    const prismaDest = path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'prisma', 'source');

    const prismaClientSrc = path.join(context.outDir, '..', '..', '..', 'node_modules', '.prisma');
    const prismaClientDest = path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'app', 'node_modules', '.prisma');

    console.log('Copying Prisma from', prismaSrc, 'to', prismaDest);
    console.log('Copying Prisma Client from', prismaClientSrc, 'to', prismaClientDest);

    try {
        await fs.copy(prismaSrc, prismaDest);
        await fs.copy(prismaClientSrc, prismaClientDest);
        console.log('Prisma duplication complete.');
    } catch (err) {
        console.error('Error copying Prisma:', err);
        throw err;
    }
};
