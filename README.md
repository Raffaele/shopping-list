# shopping-list

Offline-first Progressive Web App for managing shopping lists. Client-only (no backend), mobile-first, installable, deployed to GitHub Pages. Data is stored locally in IndexedDB.

## How it works

- You manage **several stores (shops)**. Each store has its own shopping list.
- Each item to buy has a **name**, a **quantity** and a **priority** from 1 (lowest) to 3 (highest). Lists show the highest priority first.
- An item can be added to **multiple stores**. When you mark it as **found**, it is removed from all of them.
- Deleting a store also deletes the items that belong only to that store.

All data stays on the device (IndexedDB) and is accessed through an asynchronous storage layer, so the data source can be changed later without touching the UI.

## Commands

```bash
npm run dev                  # dev server
npm run build                # production build (dist/)
npm run preview              # serve the production build (test PWA/offline)
npm run typecheck            # tsc -b
npm run lint                 # eslint
npm run test                 # vitest run
npm run format               # prettier --write
npm run generate-pwa-assets  # regenerate icons from public/icon.svg
```

Requires Node >= 24 (see `.nvmrc`) and npm.

## Deployment

Live app: <https://raffaele.github.io/shopping-list/>

Every push to `master` runs `.github/workflows/deploy.yml`: install → typecheck → lint → test → build → deploy to GitHub Pages. The app is served under `/shopping-list/` (`base` in `vite.config.ts`) and uses hash routing.

**Manual step:** on GitHub, go to Settings → Pages → Build and deployment → Source: **GitHub Actions**.

## Tech

React, TypeScript, Vite, React Router (hash), Zustand, Dexie, Radix Primitives, CSS Modules, i18next (en, it, fr, es, de, ru), vite-plugin-pwa, Vitest.
