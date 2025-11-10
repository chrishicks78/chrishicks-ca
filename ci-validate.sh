#!/bin/bash
set -e

echo "1) Validating instance against instance schema (with protocol refs)…"
npx ajv validate -s nova.instance.schema.json -r nova.protocol.schema.json -d nova.instance.chris.json --strict

echo "2) Validating capability manifest…"
npx ajv validate -s nova.capability.manifest.schema.json -d nova.capability.manifest.json --strict

echo "3) Running resolver…"
node -e "const {resolveConfig}=require('./nova.resolver.js'); const {handshake}=resolveConfig('./nova.protocol.schema.json','./nova.instance.chris.json','./nova.capability.manifest.json'); console.log(handshake);" > handshake.txt

echo "4) Checking handshake status…"
grep -Eq "status=DEGRADED|status=READY|status=PASS" handshake.txt || (echo "\u2717 Handshake missing status" && exit 1)
grep -q "status=DEGRADED" handshake.txt && echo "\u2713 Text-first binding active (expected for OpenAI SaaS)"

echo "\u2705 All checks passed."
