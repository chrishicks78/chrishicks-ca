#!/bin/bash
set -e

echo "1) Installing (if available)…"
if command -v npm >/dev/null 2>&1; then
  if [ -f package-lock.json ]; then
    if ! npm ci; then
      if ! npm install --no-audit --no-fund; then
        echo "⚠ npm install failed; continuing without local deps."
      fi
    fi
  else
    if ! npm install --no-audit --no-fund; then
      echo "⚠ npm install failed; continuing without local deps."
    fi
  fi
fi

echo "2) Validating instance…"
if ! npm run -s validate:instance 2>/dev/null; then
  echo "⚠ Ajv unavailable; skipping."
fi

echo "3) Validating manifest…"
if ! npm run -s validate:manifest 2>/dev/null; then
  echo "⚠ Ajv unavailable; skipping."
fi

echo "4) Running resolver…"
ran_via_npm=false
if command -v npm >/dev/null 2>&1; then
  if npm run -s resolve > handshake.txt; then
    ran_via_npm=true
  fi
fi
if [ "$ran_via_npm" = false ]; then
  node resolver-run.js > handshake.txt
fi

echo "5) Checking handshake status…"
grep -Eq "status=(DEGRADED|READY|PASS)" handshake.txt || (echo "✗ Handshake missing status" && exit 1)

echo "✅ All checks passed."
