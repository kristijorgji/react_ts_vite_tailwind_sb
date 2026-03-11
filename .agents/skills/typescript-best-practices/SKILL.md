---
name: typescript-best-practices
description: >
  Use when writing, reviewing, or refactoring TypeScript code in this project.
  Covers type safety, code reuse, modularity, import conventions, and formatting.
  Do not use for non-TypeScript files or for component-level UI guidelines (see frontend-component-guidelines instead).
---

# TypeScript Best Practices

## No `any`

Never use `any`. If the type is truly unknown, use `unknown` and narrow it with
type guards. For callback parameters you don't need, use `_` prefixed names with
their actual type.

```typescript
// Bad
function parse(data: any) { ... }

// Good
function parse(data: unknown): ParsedResult {
  if (typeof data === 'string') { ... }
}
```

## Type Everything

All function parameters, return values, component props, state, and API
responses must have explicit types or interfaces. Define them in the appropriate
location:

- Shared/domain types go in `src/c/types/` (e.g., `core.ts`, `api.ts`).
- Component-scoped types can live in the component file or a sibling `types.ts`.
- Hook return types should be explicitly typed when exported.

```typescript
// Good — explicit prop type and return type
interface UserCardProps {
    user: MeUser;
    onSelect: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onSelect }) => { ... };
```

## Reuse Before Creating

Before creating new types, utilities, hooks, or helpers, check whether existing
code can be reused or extended:

- **Types:** `src/c/types/`
- **Hooks:** `src/c/hooks/`
- **Utilities:** `src/c/utils/`
- **Services:** `src/c/services/`
- **Core infrastructure:** `src/core/`

Extend existing types with intersection or `extends` rather than duplicating
fields.

## Modular Code

Keep files small and focused on a single responsibility:

- Extract reusable logic into custom hooks under `src/c/hooks/`.
- Extract pure helper functions into `src/c/utils/`.
- Extract API/data-access logic into `src/c/services/`.
- A component file should contain only rendering logic and minimal glue code.

## Explicit Return Types on Exports

Every exported function and hook must declare its return type explicitly. This
improves readability, catches accidental return type changes, and provides better
IDE support.

```typescript
// Good
export function useAuth(): { isLoggedIn: boolean; logout: () => void } { ... }

// Bad — inferred return type
export function useAuth() { ... }
```

## Use `type` Imports

This project enforces `verbatimModuleSyntax` in `tsconfig.json`. Always use
`import type` for type-only imports so they are erased at compile time.

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import type { MeUser } from '@/c/types/api';
```

## Path Aliases

Use the configured path aliases instead of deep relative imports:

| Alias | Target |
|-------|--------|
| `@/core/*` | `src/core/*` |
| `@/c/*` | `src/c/*` |
| `@/*` | `src/*` |

```typescript
// Good
import usePageTitle from '@/c/hooks/usePageTitle.ts';

// Bad
import usePageTitle from '../../../hooks/usePageTitle.ts';
```

## Formatting and Linting

Follow the project's ESLint and Prettier configuration:

- **Single quotes**, **semicolons**, **trailing commas** (`es5`).
- **4-space indentation**, **120-character print width**.
- **Import ordering:** builtin → external → internal → parent/sibling, each
  group alphabetized with blank lines between groups.
- **No unused variables or parameters** (prefix intentionally unused names with `_`).
- Run `yarn lint` and `yarn fix` to validate and auto-fix before committing.
