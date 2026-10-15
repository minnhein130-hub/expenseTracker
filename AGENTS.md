# AGENTS.md

Vue 3 + Vite + TypeScript expense tracker (create-vue scaffold). Single-page app; no backend.

## Commands

- `npm run dev` — dev server (Vite + vue-devtools)
- `npm run type-check` — `vue-tsc --build` (incremental; tsbuildinfo cached in `node_modules/.tmp/`)
- `npm run lint` — runs **oxlint then eslint, both with `--fix`** (mutates files in place)
- `npm run format` — Prettier over `src/` only (config files not covered)
- `npm run build` — `type-check` and `vite build` in parallel (both must pass)

Order before considering work done: `lint` -> `type-check`. No test runner is configured yet (tsconfig already excludes `src/**/__tests__/*` in anticipation).

## Toolchain quirks

- Node `^22.18.0 || >=24.12.0` (see `engines` in package.json).
- Tailwind CSS **v4** via the `@tailwindcss/vite` plugin — CSS-first config (`@import 'tailwindcss'` in `src/assets/main.css`); there is no `tailwind.config` file.
- Two linters run on every `npm run lint`: oxlint (config in `.oxlintrc.json`) and eslint (`eslint.config.ts`). The eslint config imports `eslint-plugin-oxlint` built from the oxlint config so the two don't duplicate rules. Lint rule changes belong in `.oxlintrc.json`; eslint-only rules in `eslint.config.ts`.
- Prettier: **no semicolons**, single quotes, printWidth 100. Match this style by hand; the editor config formats on save.
- TypeScript: `noUncheckedIndexedAccess: true` — index lookups can be `undefined`; handle it.
- Path alias `@` -> `src` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- tsconfig uses project references (`tsconfig.app.json` for `src/`, `tsconfig.node.json` for Vite/eslint configs). Type-check with `vue-tsc --build`, not raw `tsc`.

## Structure

- `src/main.ts` — entry; mounts `App.vue` with vue-router.
- `src/router/index.ts` — single route: `/` -> `TransactionView`.
- `src/views/` — route-level components. `vue/multi-word-component-names` is disabled here only.
- `src/features/<feature>/components/` — feature UI (currently `transactions`: `TransactionForm`, `TransactionList`). New feature code goes under `src/features/`, not `src/components/`.
- `src/components/icons/` — shared SVG icon components (template leftovers).
- `src/types/` — shared TS types (e.g. `transaction.ts`). There is no Pinia/Vuex; state is local.
