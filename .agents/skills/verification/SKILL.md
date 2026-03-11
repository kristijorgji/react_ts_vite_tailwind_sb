---
name: verification
description: >
  Use after completing all planned code changes to verify nothing is broken.
  Runs type checking, linting, tests, and builds. Must be the final step of
  every task -- do not skip any command.
---

# Verification

After all planned changes are complete, run the following commands **in order**.
Fix any issues before considering the task done.

## 1. Regenerate translation types (if locale files changed)

```bash
yarn gen:i18n
```

Only needed when `public/locales/**/*.json` files were added or modified.
Regenerates `src/i18n/resources.d.ts`.

## 2. Type check

```bash
yarn typecheck
```

Must pass with zero errors.

## 3. Lint and auto-fix

```bash
yarn fix
yarn lint
```

Run `fix` first to auto-correct formatting, then `lint` to confirm nothing
remains. Both must exit cleanly.

## 4. Run tests

```bash
yarn test
```

All tests must pass. If a new component was added, its test file must exist and
pass as well.

## 5. Build Storybook (if components changed)

```bash
yarn storybook:build
```

Only needed when component or story files were added or modified. Must complete
without errors.

## 6. Production build

```bash
yarn build
```

Must complete without errors. This also runs `tsc -b` internally.
