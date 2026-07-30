---
name: component-extraction
description: >
    Split oversized React components and hooks flagged by ESLint extraction rules.
    Use when react/no-multi-comp, max-lines-per-function, or max-lines warnings
    appear, when splitting a screen, or when extracting logic into a hook.
---

# Component Extraction

Workflow for acting on ESLint extraction warnings in
[`eslint/component-extraction-detection.js`](../../../eslint/component-extraction-detection.js).
Component file layout lives in [frontend-component-guidelines](../frontend-component-guidelines/SKILL.md).

## Detection thresholds

| Target                                         | Rules                                                        | Limits                      |
| ---------------------------------------------- | ------------------------------------------------------------ | --------------------------- |
| `**/*.tsx` (excl. tests, stories)              | `react/no-multi-comp`, `max-lines-per-function`, `max-lines` | 70 lines/fn, 300 lines/file |
| `**/use*.ts`, `**/hooks/**/*.ts` (excl. tests) | `max-lines-per-function`                                     | 120 lines/fn                |

All rules are **warn-only** — they signal extraction candidates, not blockers.

## Workflow

### 1. Confirm the signal

```bash
pnpm lint
```

Map warnings to the thresholds above. If only one rule fires, address that rule's intent
(`no-multi-comp` → separate files; `max-lines` → extract subcomponents or a hook).

### 2. Decide extraction boundaries

- **Presentational vs logic** — move state/effects into a `use*.ts` hook; keep JSX thin.
- **Reuse** — search `src/c/components/shared/`, `src/c/hooks/` before creating anything new.
- Do **not** extract one-off wrappers with no clarity gain.

### 3. Apply file structure

Follow [frontend-component-guidelines](../frontend-component-guidelines/SKILL.md):

```text
ComponentName/
├── ComponentName.tsx
├── ComponentName.stories.tsx
├── ComponentName.test.tsx
└── useComponentLogic.ts   # optional extracted hook
```

- One component per file; PascalCase folder matching the export.
- Props as a named `interface`, not inline.

### 4. Coverage after extraction

| Artifact                                   | Unit test                     | Storybook story                              |
| ------------------------------------------ | ----------------------------- | -------------------------------------------- |
| Hook with logic                            | **Required** (`use*.test.ts`) | Optional                                     |
| Component with conditionals / side effects | **Required**                  | **Required**                                 |
| Thin presentational extraction             | Parent test may suffice       | Parent story may suffice (must render child) |

### 5. Verify

```bash
pnpm fix
pnpm lint
pnpm typecheck
pnpm test
```

## Anti-patterns

- Extracting without searching existing shared components/hooks first.
- Extracting a hook with logic without a matching `use*.test.ts`.
- Splitting purely to silence ESLint when the result is harder to follow.
- Adding a dedicated story for a thin slice the parent story already renders.
