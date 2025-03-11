const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running migrations from dir:', __dirname);

const possibleBinaryPaths = [
    path.join(__dirname, '..', '..', '..', 'node_modules', 'prisma', 'build', 'index.js'),
    path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'prisma', 'build', 'index.js'),
];
const prismaBinPath = possibleBinaryPaths.find(path => fs.existsSync(path));

const possibleSchemaPaths = [
    path.join(__dirname, '..', 'prisma', 'schema.prisma'),
    path.join(process.resourcesPath, 'prisma', 'schema.prisma'),
];
const prismaSchemaPath = possibleSchemaPaths.find(path => fs.existsSync(path));

try {
    console.log('Running Prisma migrations using:', { prismaBinPath, prismaSchemaPath });
    // Use process.execPath so that you run with the correct Node/Electron binary.
    execSync(`"${process.execPath}" ${prismaBinPath} migrate deploy --schema ${prismaSchemaPath}`, {
        stdio: 'inherit',
    });
    console.log('Migrations complete.');
    process.exit(0);
} catch (error) {
    console.error('Migrations failed:', error);
    process.exit(1);
}
