#!/bin/zsh

rm -rf node_modules \
  .turbo \
  apps/web/node_modules \
  apps/web/.next \
  apps/worker/node_modules \
  apps/worker/.turbo \
  apps/worker/dist\
  packages/db/node_modules \
  packages/eslint-config/node_modules \
  packages/typescript-config/node_modules \
  packages/ui/node_modules \
  packages/queue/node_modules \
  packages/queue/dist \
  

echo "Deleted node_modules, .turbo, and build directories."