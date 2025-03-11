const fs = require('fs-extra');
const path = require('path');

module.exports = async function duplicatePrisma(context) {
    const prismaSrc = path.join(context.outDir, '..', '..', '..', 'node_modules', 'prisma');
    const prismaDest1 = path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'prisma', 'source');
    const prismaDest2 = path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'app.asar.unpacked', 'node_modules', 'prisma');

    const prismaPkgSrc = path.join(context.outDir, '..', '..', '..', 'node_modules', '@prisma');
    const prismaPkgDest = path.join(
        context.appOutDir,
        'Abyss.app',
        'Contents',
        'Resources',
        'app.asar.unpacked',
        'node_modules',
        '@prisma'
    );

    const prismaClientSrc = path.join(context.outDir, '..', '..', '..', 'node_modules', '.prisma');
    const prismaClientDest = path.join(
        context.appOutDir,
        'Abyss.app',
        'Contents',
        'Resources',
        'app.asar.unpacked',
        'node_modules',
        '.prisma'
    );

    console.log('Copying Prisma from', prismaSrc, 'to', prismaDest1);
    console.log('Copying Prisma from', prismaSrc, 'to', prismaDest2);
    console.log('Copying Prisma Client from', prismaClientSrc, 'to', prismaClientDest);
    console.log('Copying Prisma Package from', prismaPkgSrc, 'to', prismaPkgDest);
    try {
        await fs.copy(prismaSrc, prismaDest1);
        await fs.copy(prismaSrc, prismaDest2);
        await fs.copy(prismaClientSrc, prismaClientDest);
        await fs.copy(prismaPkgSrc, prismaPkgDest);
        console.log('Prisma duplication complete.');
    } catch (err) {
        console.error('Error copying Prisma:', err);
        throw err;
    }
};
