const esbuild = require('esbuild');
const { execSync } = require('child_process');

/** @type {import('esbuild').BuildOptions} */
const commonConfig = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    outfile: 'dist/index.js',
    sourcemap: true,
    minify: process.env.NODE_ENV === 'production',
    external: [
        '@aws-sdk/client-bedrock-runtime',
        '@aws-sdk/client-dynamodb',
        '@aws-sdk/client-s3',
        '@aws-sdk/lib-dynamodb',
        'dotenv',
        'uuid',
        'zod',
        'axios',
    ],
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
