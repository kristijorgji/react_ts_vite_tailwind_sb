---
name: commit-message
description: >
    Generate Conventional Commit messages for this React + Vite boilerplate.
    Use when the user asks for a commit message, commit title/body, or invokes
    /commit-message.
disable-model-invocation: true
---

# Commit message

## Purpose

Produce a **single** Conventional Commit message for this repository. Output it in a
`text` code block so the user can copy it without markdown reordering.

## Format

```text
<type>(<scope>): <short summary>

<body — bullet points explaining what and why>
```

### Types

| Type       | When to use                                   |
| ---------- | --------------------------------------------- |
| `feat`     | New component, hook, page, or capability      |
| `fix`      | Bug fix                                       |
| `docs`     | README / AGENTS / docs only                   |
| `refactor` | Restructure with no behaviour change          |
| `chore`    | Housekeeping, ignores, non-functional cleanup |
| `ci`       | Lint tooling, hooks, CI config                |
| `test`     | Tests only                                    |
| `revert`   | Reverts a previous commit                     |

### Scopes (examples)

`ui`, `i18n`, `config`, `ci`, `docs`, `test`, `vite`, `storybook` — comma-separate when needed.

- Subject: lowercase, imperative, **≤72 characters**, no trailing period
- One subject only

## Body: grouped format (preferred for multi-area)

```text
<type>(<scope1>,<scope2>): <short summary>

ui:
- <what changed; why if non-obvious>

config:
- <bullet when eslint/vite/package scripts changed>

docs:
- <bullet when README or AGENTS.md changed>
```

| Label     | Typical paths                                                                    |
| --------- | -------------------------------------------------------------------------------- |
| `ui:`     | `src/c/components/`, `src/c/hooks/`                                              |
| `config:` | `eslint.config.js`, `vite.config.ts`, `package.json`, `.jscpd.json`, `knip.json` |
| `docs:`   | `README.md`, `AGENTS.md`                                                         |
| `ci:`     | `.github/`, `.husky/`, lint scripts                                              |

- Each bullet **≤120 characters**; intent/outcome, not file lists

## README / AGENTS update requirement

Every `feat`, `fix`, and `refactor` **must** include README (and AGENTS if agent
workflows changed) updates when setup steps, env vars, pnpm scripts, or agent
entry points change.

## Workflow

1. `git status`, `git diff` (staged + unstaged), `git log -n 10 --format=%B`
2. Choose type / scope(s); write one imperative subject
3. Group body under area labels as needed
4. Return **only** the commit message in a `text` code block unless alternatives are requested

## Quality checks

- [ ] Valid Conventional Commit; single subject
- [ ] Body bullets ≤120 chars; no empty area headers
- [ ] README/AGENTS bullets when required
- [ ] No secrets / `.env` / key material unless user staged them
- [ ] Prefer no `Co-authored-by: Cursor` trailer unless the user asks for it
