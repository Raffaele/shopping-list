# shopping-list

Offline-first Progressive Web App for managing shopping lists. Client-only SPA: **no backend, no runtime network calls**. Optimized for mobile, deployed to GitHub Pages.

## Stack (do not change without asking)

| Concern         | Choice                                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | React + TypeScript (strict) + Vite                                                                                                              |
| Package manager | **npm only** (never yarn/pnpm). Node >= 24                                                                                                      |
| Routing         | React Router, **hash routing only** (`createHashRouter`). Never `BrowserRouter`/`createBrowserRouter`: GitHub Pages has no server-side fallback |
| Styling         | CSS Modules + design tokens (CSS custom properties) in `src/styles/tokens.css`. **No Tailwind, no CSS-in-JS**                                   |
| UI primitives   | Radix Primitives (`radix-ui` package), styled with CSS Modules                                                                                  |
| State           | Zustand (`persist` middleware for user settings)                                                                                                |
| Persistence     | IndexedDB via Dexie + `dexie-react-hooks`. `localStorage` only for small settings (via Zustand persist / i18next cache)                         |
| i18n            | i18next + react-i18next + i18next-browser-languagedetector                                                                                      |
| PWA             | vite-plugin-pwa (Workbox), `registerType: 'autoUpdate'`                                                                                         |
| Tests           | Vitest + Testing Library + jsdom + fake-indexeddb                                                                                               |
| Lint/format     | ESLint (typescript-eslint type-checked + react-hooks) + Prettier                                                                                |

## Commands

```bash
npm run dev         # dev server
npm run build       # production build (dist/)
npm run preview     # serve the production build (use this to test PWA/offline)
npm run typecheck   # tsc -b
npm run lint        # eslint
npm run test        # vitest run
npm run format      # prettier --write
```

## Definition of done

Before considering any task finished, run and make pass:

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

Never disable a lint rule, skip a test, or weaken types to make these pass. Fix the cause.

## Rules

### TypeScript

- `strict` mode. No `any`, no `@ts-ignore`/`@ts-expect-error`. Use `unknown` + narrowing.
- No non-null assertions (`!`) except for the root element in `main.tsx`.
- Prefer named exports.

### Offline / no backend

- No runtime network requests: no API calls, no CDN scripts, fonts, or images. Everything is bundled.
- Fonts: system font stack only (must support Latin and Cyrillic).
- **Persist every user change to IndexedDB immediately.** The app auto-updates and may reload at any moment; never keep unsaved user data only in memory.
- Translation files are imported statically (bundled), never loaded over HTTP.

### Paths / GitHub Pages

- The app is served under a sub-path (see `base` in `vite.config.ts`). Never hardcode absolute URLs starting with `/` for assets. Import assets or use `import.meta.env.BASE_URL`.

### i18n

- Supported languages: `en` (fallback), `it`, `fr`, `es`, `de`, `ru`. Locale files: `src/i18n/locales/<lng>.json`.
- **No hard-coded user-facing strings** in components. Always `t('key')`.
- Every new key must be added to **all six** locale files in the same change, with real translations (not English copies). A test enforces key parity.
- Plurals use i18next suffixes (`_one`, `_other`, …). Russian requires `_one`, `_few`, `_many`, `_other`.
- Format numbers and dates with `Intl` using the current language.
- Language names in the language picker are shown in their own language (English, Italiano, Français, Español, Deutsch, Русский).

### Styling / mobile

- Mobile-first. Minimum touch target 44×44 px.
- Inputs use `font-size` >= 16px (prevents iOS zoom on focus).
- Use `100dvh`, and respect `env(safe-area-inset-*)`.
- Colors, spacing, radii, and font sizes come only from tokens in `tokens.css`. Every component must work in both light and dark themes.
- Theme is applied via `data-theme="light|dark"` on `<html>`.
- One component per folder: `Component.tsx` + `Component.module.css` (+ `Component.test.tsx`).

### Accessibility

- Use Radix Primitives for dialogs, dropdowns, selects, tabs, radio groups, toasts, etc. Do not hand-roll them.
- Semantic HTML, every input has a label, icon-only buttons have `aria-label` (translated).

### Dependencies

- **Ask before adding any new dependency.** Never add a UI kit, CSS framework, or another state/routing library.

## Project structure

```
src/
  app/          router, root layout, providers
  pages/        route screens (Home, Settings, NotFound)
  components/   reusable UI components
  features/     feature modules (shopping lists etc.)
  db/           Dexie database and schema
  i18n/         i18next config, types, locales/*.json
  stores/       Zustand stores
  pwa/          service worker registration and update logic
  styles/       tokens.css, global.css
  test/         Vitest setup and helpers
```

## Behaviour already in place

- **Theme**: setting `'system' | 'light' | 'dark'` (default `'system'`), stored in the settings store. `'system'` follows `prefers-color-scheme` live. `<meta name="theme-color">` is updated to match.
- **Language**: detected from the device on first launch (fallback `en`), changeable in Settings, persisted. `<html lang>` follows the current language.
- **Updates**: auto-update. The service worker checks for a new version on start, when the app becomes visible, when the device comes back online, and every hour. The new version activates and the page reloads automatically.
- **Storage**: `navigator.storage.persist()` is requested at startup to reduce the risk of data eviction (especially iOS).
- **Version**: `__APP_VERSION__` (from `package.json`) is shown in Settings.

## Deployment

GitHub Actions builds and deploys to GitHub Pages on every push to `main` (`.github/workflows/deploy.yml`): install → typecheck → lint → test → build → deploy.
