#!/bin/bash

# Remove existing schema.prisma file if it exists
rm -f ./prisma/schema.prisma 2>/dev/null || true
rm -rf ./prisma/prisma 2>/dev/null || true

# Create dist directory if it doesn't exist
mkdir -p ./prisma
touch ./prisma/schema.prisma

# Concatenate all .prisma files into a single schema file
find . -name "*.prisma" -type f -exec cat {} \; >> ./prisma/schema.prisma

# Change directory to parent and format the Prisma schema
prisma format --schema=./prisma/schema.prisma

# Generate Prisma client
prisma generate --schema=./prisma/schema.prisma

# Migrate the database
prisma migrate dev --schema=./prisma/schema.prisma -n "$(date +%s)_$(openssl rand -hex 4)"