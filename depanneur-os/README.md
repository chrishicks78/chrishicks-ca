# Lydia's Dépanneur OS

Local-first PWA for running a neighbourhood depanneur from one shared counter laptop.

Current production app:

- https://depanneur-os-build.vercel.app/en

## What This Build Includes

- Shift start for `Owner`, `Wife / Manager`, and `Employee`
- Owner Money Board with repair-fund framing
- Montreal / NDG Smart Sourcing Agent
- High-entropy Intake Hopper with mock structured parsing
- Inventory board with large counting controls
- Special customer requests board
- Quebec compliance and supplier rhythm board
- `.ics` heartbeat calendar export
- Google Keep push
- JSON backup and restore
- Day / night theme toggle
- English, French, Simplified Chinese, and Traditional Chinese
- Installable PWA shell with offline fallback
- Persistent soundtrack controls

## Daily Use

For normal store use, no local install is required.

1. Open the live app in Chrome or Edge.
2. Go to `https://depanneur-os-build.vercel.app/en`
3. Use the browser's `Install App` option if you want a pinned counter app on desktop or phone.

## Local Development

Requirements:

- Node.js 20+
- npm

Commands:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/en
```

Production build:

```bash
npm run build
```

## Important Windows / Google Drive Note

If this repo is opened directly inside Google Drive or another cloud-synced folder, `npm install` may fail while extracting `node_modules`.

If that happens:

1. Copy the project into a normal local folder outside the sync client.
2. Run `npm install` there.
3. Run `npm run dev` or `npm run build` from that local copy.

This issue is environmental, not application-level. The app was successfully built and deployed from a clean local mirror outside the synced workspace.

## Key Files

- `src/app/[locale]/page.tsx`: localized app route
- `src/components/depanneur-dashboard.tsx`: main operating surface
- `src/components/depanneur-dashboard.module.css`: Aero Glass laptop-first styling
- `src/lib/dashboard-copy.ts`: email-safe UI copy and labels
- `src/lib/ops-data.ts`: default data, sourcing logic, parser, calendar export
- `src/lib/local-store.ts`: local persistence
- `public/sw.js`: service worker
- `src/app/manifest.ts`: PWA manifest
