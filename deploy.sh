#!/bin/bash
echo "copy files ..."

rm -rf dist
mkdir dist

cp -R ./lib/ ./dist/lib/
cp -R ./system/ ./dist/system/
cp -R ./utils/ ./dist/utils/
cp -R ./package.json ./dist/package.json
cp -R ./server.js ./dist/server.js