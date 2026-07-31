---
name: project-conventions
description: >
    Reuse-first conventions, source layout, secrets, README/AGENTS upkeep, and
    package-manager notes for this React + Vite boilerplate. Use when adding
    features, changing setup behaviour, or structuring new files.
---

# Project conventions

## Reuse before implementing

Before adding components, hooks, utilities, or types, **search this repo first**:

- Shared components: `src/c/components/shared/`
- Page components: `src/c/components/pages/`
- Hooks: `src/c/hooks/`
- Utilities: `src/c/utils/`
- Services: `src/c/services/`
- Types: `src/c/types/`
- Core infrastructure: `src/core/`

Extend existing modules rather than duplicating patterns.

## Layout

| Path                | Role                                           |
| ------------------- | ---------------------------------------------- |
| `src/c/components/` | UI components (`pages/`, `shared/`)            |
| `src/c/hooks/`      | Shared React hooks                             |
| `src/c/utils/`      | Pure helpers                                   |
| `src/c/services/`   | API / data access                              |
| `src/c/types/`      | Shared / domain types                          |
| `src/core/`         | App infrastructure (routing, providers)        |
| `src/i18n/`         | i18n bootstrap; generated `resources.d.ts`     |
| `public/locales/`   | Translation JSON (`en/`, `de/`)                |
| `.storybook/`       | Storybook config                               |
| `test/`             | Shared test setup, mocks (`@test/*`), fixtures |

## Style source of truth

Follow ESLint ([`eslint.config.js`](../../../eslint.config.js)) and Prettier
([`.prettierrc.js`](../../../.prettierrc.js)):

- TypeScript for all new source under `src/`
- Keep import ordering and formatting as enforced by `pnpm lint` / `pnpm fix`

## Package manager

This repo uses **pnpm** (see `packageManager` in `package.json`). Do not introduce
`yarn` or `npm` install workflows.

## README / AGENTS maintenance

Any change to setup steps, env vars, pnpm scripts, or agent workflows must update:

- Root `README.md` when Getting Started, tooling, or dependency notes change
- `AGENTS.md` when agent-facing workflows or skill entry points change

## Secrets and credentials

- Never hardcode secrets, tokens, or private keys in committed files.
- `.env` is gitignored; commit only `.env.dist` with non-secret placeholders.
- Frontend-accessible env vars must use the `VITE_` prefix; prefer reading via
  `src/env.ts` rather than raw `import.meta.env` scattered in components.
