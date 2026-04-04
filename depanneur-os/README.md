# Lydia's Depanneur OS

Progressive Web App for corner store management at Lydia's Depanneur in NDG, Montreal.

## About

This directory contains **pre-built Vite output** — the compiled React application and static assets. Source code is maintained separately.

Deployed at: `https://chrishicks78.github.io/chrishicks-ca/depanneur-os/`

## Structure

| File | Purpose |
|------|---------|
| `index.html` | SPA entry point |
| `manifest.json` | PWA manifest (standalone display, dark theme) |
| `sw.js` | Service worker — network-first caching with offline fallback |
| `favicon.svg` | App icon |
| `assets/` | Hashed JS/CSS bundles from Vite build |

## Service Worker

Uses a **network-first** caching strategy:

1. Attempt to fetch from the network
2. On success, cache the response and serve it
3. On network failure, fall back to the cached version

Only `GET` requests are cached. To invalidate the cache on deploy, bump the version string in `sw.js`.
