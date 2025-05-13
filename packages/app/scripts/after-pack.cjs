const fs = require('fs');
const path = require('path');

module.exports = async context => {
    console.log('Running after-pack script...');

    // Get the path to the app.asar.unpacked directory
    const appAsarUnpackedPath = path.join(context.appOutDir, 'Abyss.app', 'Contents', 'Resources', 'app.asar.unpacked');

    console.log('app.asar.unpacked path:', appAsarUnpackedPath);

    // Check if the directory exists
    if (fs.existsSync(appAsarUnpackedPath)) {
        console.log('app.asar.unpacked directory exists');

        // Copy SQLite native module to app.asar.unpacked/build
        const sqliteSourcePath = path.join(
            context.appOutDir,
            'Abyss.app',
            'Contents',
            'Resources',
            'app.asar.unpacked',
            'node_modules',
            'sqlite3',
            'build',
            'Release',
            'node_sqlite3.node'
        );

        // Create build directory if it doesn't exist
        const buildDirPath = path.join(appAsarUnpackedPath, 'build');
        if (!fs.existsSync(buildDirPath)) {
            fs.mkdirSync(buildDirPath, { recursive: true });
            console.log('Created build directory:', buildDirPath);
        }

        const sqliteDestPath = path.join(buildDirPath, 'node_sqlite3.node');

        try {
            fs.copyFileSync(sqliteSourcePath, sqliteDestPath);
            console.log('Successfully copied SQLite native module from', sqliteSourcePath, 'to', sqliteDestPath);
        } catch (error) {
            console.error('Failed to copy SQLite native module:', error);
        }
    } else {
        console.log('app.asar.unpacked directory does not exist');
    }
};
