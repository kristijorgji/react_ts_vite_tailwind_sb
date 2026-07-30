---
name: test-deduplication
description: >
    Refactor duplicated test mocks and copy-pasted test blocks using the mock
    usage analyzer and jscpd. Use when deduplicating vi.mock factories,
    copy-pasted test setup, or when the user invokes /test-deduplication.
disable-model-invocation: true
---

# Test Deduplication

Workflow for reducing duplication in tests and stories. Mock typing conventions
live in [testing/SKILL.md](../testing/SKILL.md) — link, do not duplicate.

## Tools

Run both from the repo root (on-demand; they do **not** fail `pnpm lint`):

```bash
pnpm analyze:test-mocks    # → reports/test-mock-usage/report.md
pnpm dupcheck:tests        # → reports/jscpd-tests/
```

| Tool                 | Best for                                                   |
| -------------------- | ---------------------------------------------------------- |
| `analyze:test-mocks` | Repeated `vi.mock` factories for the same module           |
| `dupcheck:tests`     | Copy-pasted setup/assertions in `*.test.*` / `*.stories.*` |

Env vars for the analyzer: `MIN_OCCURRENCES` (default 2), `MIN_LINES` (default 8),
`SIMILARITY_THRESHOLD` (default 0.8).

## Workflow

1. Run both analyzers and read the reports.
2. Extract identical / near-duplicate mocks into `@test/mocks/` (or a colocalized
   `create*Mock` when used by a single feature folder).
3. For jscpd hits, prefer extracting setup/wiring over assertion one-liners.
4. Re-run the analyzers and scoped tests after extraction.
