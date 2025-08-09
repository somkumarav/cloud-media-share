#!/bin/zsh

rm -rf node_modules \
  .turbo \
  apps/web/node_modules \
  apps/web/.next \
  packages/db/node_modules \
  packages/eslint-config/node_modules \
  packages/typescript-config/node_modules \
  packages/ui/node_modules 
  

echo "Cleaned up node_modules and typescript-config directories."