# shopping-list

Offline-first Progressive Web App for managing shopping lists. Client-only (no backend), mobile-first, installable, deployed to GitHub Pages. Data is stored locally in IndexedDB.

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

Every push to `main` runs `.github/workflows/deploy.yml`: install → typecheck → lint → test → build → deploy to GitHub Pages. The app is served under `/shopping-list/` (`base` in `vite.config.ts`) and uses hash routing.

**Manual step:** on GitHub, go to Settings → Pages → Build and deployment → Source: **GitHub Actions**.

## Tech

React, TypeScript, Vite, React Router (hash), Zustand, Dexie, Radix Primitives, CSS Modules, i18next (en, it, fr, es, de, ru), vite-plugin-pwa, Vitest.
