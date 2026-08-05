---
name: linting
description: >-
    Run make fix / make lint / make test (pnpm ESLint/Prettier/Vitest, and Docker
    markdown) after editing repo files. Use when finishing a change set or
    before suggesting a commit.
---

# Lint and fix after changes

After editing repo files and before considering the task complete (or before suggesting a commit),
run the appropriate Make targets from the **repository root**. Markdown targets need **Docker**.

## Workflow

1. Run **`make fix`** (or a scoped subset below) on auto-fixable file types you changed.
2. Run **`make lint`** when multiple areas changed or as a final verification gate.
3. Run **`make test`** when you changed component/hook/service logic that has coverage.

| Files you changed               | Auto-fix            | Verify               |
| ------------------------------- | ------------------- | -------------------- |
| `**/*.{ts,tsx,js,jsx}` (`src/`) | `pnpm fix`          | `pnpm lint`          |
| `**/*.md`                       | `make fix-markdown` | `make lint-markdown` |
| Component/hook/service logic    | —                   | `make test`          |
| Mixed / unsure                  | `make fix`          | `make lint`          |

Aggregators:

- `make fix` → `pnpm fix` + `fix-markdown`
- `make lint` → `pnpm lint` (`lint:eslint` + jscpd + knip) + `lint-markdown`
- `make test` → `pnpm test`

## Git hooks

Once per clone:

```shell
make dev-init
make verify-hooks
```

Prefer the `verification` skill's full gate before merging:

`pnpm fix && pnpm lint && pnpm typecheck && pnpm test && pnpm build`
