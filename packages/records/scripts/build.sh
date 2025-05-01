#!/bin/bash
set -e

# Clean dist directory
rm -rf dist
mkdir -p dist

npx tsc

npx esbuild src/index.ts --bundle --platform=node --target=node14 --outfile=dist/index.js --external:prisma

cp -r ./prisma/* ./dist
cp -r ./prisma/prisma/*.node ./dist

echo "Build completed successfully!"
