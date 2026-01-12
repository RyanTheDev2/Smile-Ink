#!/bin/bash
# Rebuild everything
npx tsx script/build.ts
# Start the bundled server
node dist/index.cjs
