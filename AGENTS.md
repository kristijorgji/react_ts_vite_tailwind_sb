# Agent guide

React + TypeScript + Vite + Tailwind + Storybook boilerplate.

## Read first

| Resource                             | Purpose                                                                                                                       |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| [README.md](README.md)               | Setup, scripts, troubleshooting                                                                                               |
| [`.agents/skills/`](.agents/skills/) | Task skills (conventions, components, TypeScript, testing, storybook, verification, commits, docs)                            |
| [`package.json`](package.json)       | Scripts: `lint` (eslint+jscpd+knip), `lint:eslint`, `fix`, `test`, `dupcheck`, `dupcheck:tests`, `knip`, `analyze:test-mocks` |

`.agents/skills/vendor/` is generated at `pnpm install` from `@kristijorgji/*/skills`
(see `scripts/sync-agent-skills.mjs`). Do not edit those files by hand.

Cursor rules under [`.cursor/rules/`](.cursor/rules/) are lean wrappers that
**import** those skills. Agent hard-ignore SSoT is [`.aiignore`](.aiignore);
[`.cursorignore`](.cursorignore), [`.codeiumignore`](.codeiumignore),
[`.aiexclude`](.aiexclude), [`.clineignore`](.clineignore), and
[`.geminiignore`](.geminiignore) are symlinks to it.

## Stack

- Node ≥22.16 (see `.nvmrc`), **pnpm**, TypeScript, React 19, Vite, Tailwind 4
- Vitest + Testing Library; Storybook 10 with Vitest browser project
- i18next for translations (`public/locales/`)

## Layout (where to look)

| Path                                            | Role                     |
| ----------------------------------------------- | ------------------------ |
| `src/c/components/`                             | UI (`pages/`, `shared/`) |
| `src/c/hooks/`, `utils/`, `services/`, `types/` | Shared non-UI modules    |
| `src/core/`                                     | App infrastructure       |
| `public/locales/`                               | Translation JSON         |
| `.storybook/`                                   | Storybook config         |

## Quality before finishing work

```shell
pnpm fix
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

See [.agents/skills/verification/SKILL.md](.agents/skills/verification/SKILL.md).

## Commits

Conventional Commits — [.agents/skills/commit-message/SKILL.md](.agents/skills/commit-message/SKILL.md).
