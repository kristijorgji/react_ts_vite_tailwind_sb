---
name: testing
description: >
    Test conventions for this Vite + React boilerplate. Use when writing or editing
    *.test.ts, *.test.tsx, or *.spec.* files. Covers Vitest, Testing Library,
    mock typing, and shared fixtures under @test/*.
---

# Testing

Keep test files small. Prefer shared `@test/*` mocks over repeating setup and
domain literals.

## Stack

- **Vitest** + **React Testing Library** + **jsdom** (unit project)
- Storybook interaction tests run in a separate Vitest browser project
- Shared setup: [`test/setup.ts`](../../../test/setup.ts)
- Shared route fixtures: [`@test/data/routes`](../../../test/data/routes.ts)
- Shared mocks: [`@test/mocks/*`](../../../test/mocks/)

## Queries

| Layer                              | Locator policy                                                                                                                                                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Unit (Vitest + RTL)**            | With `react-i18next` mocked so `t` returns keys (e.g. `common:logout`), prefer `getByText` / `getByRole` / `getByLabelText` when they assert real UI semantics. `getByTestId` is allowed but not required. |
| **Storybook interaction (`play`)** | Prefer `data-testid`. Stories use real i18n and a locale toolbar, so translated labels are unstable across globals. Use role/label queries only when asserting accessibility itself.                       |
| **E2E (Playwright, later)**        | Prefer `data-testid` — real i18n cannot be mocked, so translated labels are unstable. Keep `data-testid` on interactive production components; production builds strip them unless `E2E_TESTING=true`.     |

## Mock typing

ESLint enforces:

| Situation                                               | Required style                                                  |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| Module-level / `const` mock object or array             | Type annotation on the binding: `const loc: Location = { ... }` |
| Inline `.mockReturnValue` / `.mockResolvedValue` body   | `satisfies NamedType`                                           |
| Inline `.toEqual` / `.toStrictEqual` / `.toMatchObject` | `satisfies NamedType`                                           |
| `const` from a typed function call (not a literal)      | No binding annotation needed                                    |

Reserve `satisfies` for **inline** mock/expect arguments — do **not** write
`const mock = { ... } satisfies Type` when a binding annotation is intended.

Prefer existing exported types, then `Awaited<ReturnType<typeof fn>>`, then
`Pick` / `Partial` / `Omit` of an existing type. Do not invent weak
`satisfies any|unknown|object` or inline `{ a: number }` types.

## i18n in tests

```typescript
vi.mock('react-i18next', async () => {
    const { createReactI18nextMockModule } = await import('@test/mocks/react-i18next');
    return createReactI18nextMockModule({ language: 'en' });
});
```

For mutable language or spreading the real module, use `createReactI18nextPartialMock`
(also via dynamic `import()` inside the `vi.mock` factory so Vitest hoist stays safe).

## Coverage expectations

- Render without crashing
- User interactions (clicks, inputs)
- Conditional rendering (loading, error, empty)

See `LoginPage.test.tsx` and `Header.test.tsx` as references.

## Deduplication (on-demand)

```bash
pnpm dupcheck:tests        # jscpd on *.test.* / *.stories.*
pnpm analyze:test-mocks    # near-duplicate vi.mock factories
```

See [test-deduplication](../test-deduplication/SKILL.md).
