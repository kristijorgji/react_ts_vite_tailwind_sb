---
name: verification
description: >
    Use after completing all planned code changes to verify nothing is broken.
    Runs type checking, linting, duplication checks, knip, tests, and builds.
    Must be the final step of every task -- do not skip any command.
---

# Verification

After all planned changes are complete, run the following commands **in order**.
Fix any issues before considering the task done.

## 1. Regenerate translation types (if locale files changed)

```bash
pnpm gen:i18n
```

Only needed when `public/locales/**/*.json` files were added or modified.
Regenerates `src/i18n/resources.d.ts`.

## 2. Lint and auto-fix

```bash
pnpm fix
pnpm lint
```

Run `fix` first to auto-correct formatting and sortable issues, then `lint`
(ESLint via `lint:eslint` + jscpd + knip) to confirm nothing remains. All must exit cleanly.

## 3. Type check

```bash
pnpm typecheck
```

Must pass with zero errors.

## 4. Run tests

```bash
pnpm test
```

All tests must pass. If a new component was added, its test file must exist and
pass as well.

## 5. Build Storybook (if components changed)

```bash
pnpm storybook:build
```

Only needed when component or story files were added or modified. Must complete
without errors.

## 6. Production build

```bash
pnpm build
```

Must complete without errors. This also runs `tsc -b` internally.
