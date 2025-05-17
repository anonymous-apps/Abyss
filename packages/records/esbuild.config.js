const esbuild = require('esbuild');
const { execSync } = require('node:child_process');

/** @type {import('esbuild').BuildOptions} */
const commonConfig = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node14',
    format: 'cjs',
    outfile: 'dist/index.js',
    external: ['sqlite3'],
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production',
};

if (require.main === module) {
    // Build JavaScript files
    esbuild
        .build(commonConfig)
        .then(() => {
            // Generate TypeScript declaration files
            execSync('tsc --emitDeclarationOnly --declaration --outDir dist', { stdio: 'inherit' });
        })
        .catch(() => process.exit(1));
}

module.exports = commonConfig;
