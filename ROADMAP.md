# Roadmap

Work plan for the app. Tick a box (`[x]`) when the item is done. Domain rules are in `CLAUDE.md` (Domain model, Data access).

## 0. Project skeleton

- [x] Vite + React + TypeScript project, tooling (ESLint, Prettier, Vitest)
- [x] Hash routing, layout, Home / Settings / NotFound pages
- [x] Theme (system / light / dark) and language (en, it, fr, es, de, ru)
- [x] Dexie database, PWA registration, GitHub Actions deploy workflow
- [x] `CLAUDE.md` and `README.md`

## 1. Domain and storage facade (no UI)

- [ ] Domain types: `Store`, `Item`, `StoreItem`
- [ ] Asynchronous facade interface (no Dexie types in signatures)
- [ ] Dexie implementation in `src/db/` (schema version 2: stores, items, store-item links)
- [ ] Store operations: create, rename, delete (also deletes items left with no store)
- [ ] Item operations: create (with its stores), edit, add / remove a store
- [ ] List of a store, highest priority first
- [ ] `markFound(itemId)`: deletes the item and its links in one transaction
- [ ] Tests with fake-indexeddb for all of the above

## 2. Stores

- [ ] Stores list screen (replaces the Home empty state)
- [ ] Create, rename and delete a store
- [ ] i18n keys in all six languages
- [ ] Tests

## 3. Store list and items

- [ ] Store detail route with its items, sorted by priority (3 = highest, 1 = lowest)
- [ ] Add and edit an item: name, quantity (integer >= 1), priority (1-3), stores
- [ ] "Found" action that removes the item from every store
- [ ] Plural forms for item counts (including Russian `_few` / `_many`)
- [ ] i18n keys in all six languages
- [ ] Tests

## 4. Polish

- [ ] Confirmation dialogs for deletions (Radix `AlertDialog`)
- [ ] Undo for "found" via toast (Radix `Toast`)
- [ ] Empty states
- [ ] Accessibility check (labels, `aria-label` on icon-only buttons, touch targets)

## 5. PWA verification and deploy

- [ ] GitHub: Settings → Pages → Source: GitHub Actions
- [ ] First deploy to GitHub Pages
- [ ] Real phone test: install, airplane mode, reopen (works offline)
- [ ] Check theme and language switching on the phone
