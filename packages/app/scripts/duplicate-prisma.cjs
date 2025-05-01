const fs = require('fs-extra');
const path = require('path');

module.exports = async function duplicatePrisma(context) {
    console.log('Duplicating Prisma');
    // Define all source and destination pairs
    const copyPairs = [
        {
            name: 'Prisma Source 1',
            source: path.join(context.outDir, '..', '..', '..', 'node_modules', 'prisma'),
            destination: path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'prisma', 'source'),
        },
        {
            name: 'Prisma Source 2',
            source: path.join(context.outDir, '..', '..', '..', 'node_modules', 'prisma'),
            destination: path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'app.asar.unpacked', 'node_modules', 'prisma'),
        },
        {
            name: 'Assets',
            source: path.join(context.outDir, '..', '..', '..', 'assets'),
            destination: path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'app.asar.unpacked', 'assets'),
        },
        {
            name: 'Prisma Package',
            source: path.join(context.outDir, '..', '..', '..', 'node_modules', '@prisma'),
            destination: path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'app.asar.unpacked', 'node_modules', '@prisma'),
        },
        {
            name: 'Prisma Client',
            source: path.join(context.outDir, '..', '..', '..', 'node_modules', '.prisma'),
            destination: path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'app.asar.unpacked', 'node_modules', '.prisma'),
        },
    ];

    // Process each copy pair
    for (const pair of copyPairs) {
        console.log(`Copying ${pair.name} from ${pair.source} to ${pair.destination}`);

        try {
            // Skip if source and destination are the same
            if (pair.source === pair.destination) {
                console.log(`${pair.name} source and destination are the same. Skipping copy.`, {
                    source: pair.source,
                    destination: pair.destination,
                });
                continue;
            }

            // Delete destination if it exists
            if (fs.existsSync(pair.destination)) {
                console.log(`Removing existing destination: ${pair.destination}`);
                await fs.remove(pair.destination);
            }

            // Copy files
            await fs.copy(pair.source, pair.destination);
            console.log(`Successfully copied ${pair.name}`);
        } catch (err) {
            const errorMessage = `[duplicate-prisma] Error copying ${pair.name}: ${err}`;
            console.error(errorMessage);
            console.warn(`WARNING: Failed to copy ${pair.name}. The application may not function correctly.`);
            // Don't throw the error, continue with other copies
        }
    }

    console.log('Prisma duplication process completed.');
};
