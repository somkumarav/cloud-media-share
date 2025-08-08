#!/bin/zsh

# This script initializes the project dependencies and runs a Prisma migration.

echo "Installing all dependencies..."
pnpm install

echo "Changing directory to packages/db..."
cd packages/db

echo "Generating Prisma client..."
pnpm prisma generate

echo "Initialization script complete."