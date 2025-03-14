const fs = require('fs-extra');
const path = require('path');

module.exports = async function duplicatePrisma(context) {
    const prismaSrc = path.join(context.outDir, '..', '..', '..', 'node_modules', 'prisma');
    const prismaDest1 = path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'prisma', 'source');
    const prismaDest2 = path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'app.asar.unpacked', 'node_modules', 'prisma');

    const assetsSrc = path.join(context.outDir, '..', '..', '..', 'assets');
    const assetsDest = path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'app.asar.unpacked', 'assets');

    console.log('Copying assets from', assetsSrc, 'to', assetsDest);
    try {
        if (assetsSrc !== assetsDest) {
            await fs.copy(assetsSrc, assetsDest);
        } else {
            console.log('Assets source and destination are the same. Skipping copy.', { assetsSrc, assetsDest });
        }
    } catch (err) {
        console.error('[duplicate-prisma] Error copying assets:', err);
        throw err;
    }

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
    // Copy Prisma to first destination
    try {
        // Check if source and destination are the same before copying
        if (prismaSrc !== prismaDest1) {
            await fs.copy(prismaSrc, prismaDest1);
        } else {
            console.log('Prisma source and destination are the same. Skipping copy.', { prismaSrc, prismaDest1 });
        }
    } catch (err) {
        console.error('[duplicate-prisma] Error copying Prisma to first destination:', err);
        throw err;
    }

    // Copy Prisma to second destination
    try {
        if (prismaSrc !== prismaDest2) {
            await fs.copy(prismaSrc, prismaDest2);
        } else {
            console.log('Prisma source and destination are the same. Skipping copy.', { prismaSrc, prismaDest2 });
        }
    } catch (err) {
        console.error('[duplicate-prisma] Error copying Prisma to second destination:', err);
        throw err;
    }

    // Copy Prisma Client
    try {
        if (prismaClientSrc !== prismaClientDest) {
            await fs.copy(prismaClientSrc, prismaClientDest);
        } else {
            console.log('Prisma Client source and destination are the same. Skipping copy.', { prismaClientSrc, prismaClientDest });
        }
    } catch (err) {
        console.error('[duplicate-prisma] Error copying Prisma Client:', err);
        throw err;
    }

    // Copy Prisma Package
    try {
        if (prismaPkgSrc !== prismaPkgDest) {
            // Check if paths might be the same due to symbolic links
            console.log('Checking if paths are symbolically linked:');

            // Print the raw paths
            console.log('Raw paths:');
            console.log('- Source:', prismaPkgSrc);
            console.log('- Destination:', prismaPkgDest);

            // Resolve any symbolic links in the paths
            try {
                const realSrcPath = fs.realpathSync(prismaPkgSrc);
                const realDestPath = fs.realpathSync(prismaPkgDest);
                console.log('Resolved paths (after following symbolic links):');
                console.log('- Source:', realSrcPath);
                console.log('- Destination:', realDestPath);

                // Check if the resolved paths are the same
                if (realSrcPath === realDestPath) {
                    console.log('WARNING: Source and destination resolve to the same location after following symbolic links!');
                }
            } catch (err) {
                console.log('Error resolving real paths:', err.message);
            }

            // List directory contents to compare
            try {
                console.log('\nListing source directory contents:');
                console.log(`pwd: ${process.cwd()}`);
                console.log(`ls ${prismaPkgSrc}:`);
                const srcFiles = fs.readdirSync(prismaPkgSrc);
                srcFiles.forEach(file => console.log(`- ${file}`));

                // Check if destination exists before trying to list
                if (fs.existsSync(prismaPkgDest)) {
                    console.log('\nListing destination directory contents:');
                    console.log(`ls ${prismaPkgDest}:`);
                    const destFiles = fs.readdirSync(prismaPkgDest);
                    destFiles.forEach(file => console.log(`- ${file}`));
                } else {
                    console.log(`\nDestination directory doesn't exist yet: ${prismaPkgDest}`);
                }
            } catch (err) {
                console.log('Error listing directory contents:', err.message);
            }

            // Delete destination directory if it exists before copying
            if (fs.existsSync(prismaPkgDest)) {
                console.log(`Removing existing destination directory: ${prismaPkgDest}`);
                await fs.remove(prismaPkgDest);
                console.log(`Destination directory removed successfully.`);
            }
            await fs.copy(prismaPkgSrc, prismaPkgDest);
        } else {
            console.log('Prisma Package source and destination are the same. Skipping copy.', { prismaPkgSrc, prismaPkgDest });
        }
    } catch (err) {
        console.error('[duplicate-prisma] Error copying Prisma Package:', err);
        throw err;
    }

    console.log('Prisma duplication complete.');
};
